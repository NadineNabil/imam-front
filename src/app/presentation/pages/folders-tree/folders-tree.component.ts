
import { Component, Inject, Input, OnDestroy, OnInit, ElementRef, Renderer2, ChangeDetectionStrategy, OnChanges, SimpleChanges, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { firstValueFrom, forkJoin, shareReplay, Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { CATEGORY_BUSINESS_TOKEN, ICategoryBusiness } from 'src/app/domain/business-contracts/category-business.contract';
import { SUBCATEGORY_BUSINESS_TOKEN, ISubCategoryBusiness } from 'src/app/domain/business-contracts/subCategory-business.contract';
import { COURSE_BUSINESS_TOKEN , ICourseBusiness} from 'src/app/domain/business-contracts/course-business.contract';
import { ToastService } from 'src/app/shared/services/toast-service';
import { Category } from 'src/app/domain/entities/category.entity';
import { Course } from 'src/app/domain/entities/course.entity';
import { SubCategory } from 'src/app/domain/entities/subCategory.entity';
import { has } from '@amcharts/amcharts5/.internal/core/util/Array';

interface FolderNode {
  id: number;
  name: string;
  type: 'folder' | 'file';
  nodeType: 'category' | 'subcategory' | 'course';
  parent?: FolderNode | null;
  children?: FolderNode[];
  hasLoadedChildren?: boolean;
}

@Component({
  selector: 'app-folders-tree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  templateUrl: './folders-tree.component.html',
  styleUrls: ['./folders-tree.component.scss'],
})
export class FoldersTreeComponent implements OnInit, OnDestroy, OnChanges {

  private langSub?: Subscription;
  isRtl: boolean = false;
  pendingDelete: {
    id: number;
    name: string;
    type: 'category' | 'course';
    hasChildren: boolean;
    warningKey?: string;
    code: string;
    input: string;
    showError: boolean;
  } | null = null;
  deleteInProgress = false;
  categoriesData: Category[]=[];
 
  constructor(
    @Inject(CATEGORY_BUSINESS_TOKEN) private CategoriesBusiness: ICategoryBusiness,
    @Inject(SUBCATEGORY_BUSINESS_TOKEN) private subCategoryBusiness: ISubCategoryBusiness,
    @Inject(COURSE_BUSINESS_TOKEN) private courseBusiness: ICourseBusiness,
    private translate: TranslateService,
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
     if (this.level === 0) {
       this.getCategoriesTree();
    } 
    this.expandFoldersByDefault(this.displayNodes);

    // set initial direction and subscribe to language changes
    this.updateDirection(this.translate.currentLang || this.translate.getDefaultLang() || 'en');
    this.langSub = this.translate.onLangChange.subscribe((e: LangChangeEvent) => {
      this.updateDirection(e.lang);
    });

    // close overflow menus when clicking outside (menu click handlers stop propagation)
    this.outsideClickUnlisten = this.renderer.listen('document', 'click', () => {
      this.actionsMenuOpenIds.clear();
    });

  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    if (this.outsideClickUnlisten) {
      this.outsideClickUnlisten();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nodes']) {
      this.expandFoldersByDefault(this.displayNodes);
    }
  }

  private updateDirection(lang: string) {
    const dir = /^ar|he|fa|ur/.test(lang) ? 'rtl' : 'ltr';
    this.isRtl = dir === 'rtl';
    // set dir attribute on host element so component layout flips
    this.renderer.setAttribute(this.el.nativeElement, 'dir', dir);
    // also set document direction so global layout (if needed) updates
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.dir = dir;
    }
  }
  
  getCategoriesTree() {
    this.CategoriesBusiness.getCategoriesTree().pipe(
    ).subscribe(categories => {
      this.categoriesData=categories;
      this.apiNodes = categories.map((category) =>
        this.mapCategoryToNode(category)
      );
      this.expandFoldersByDefault(this.apiNodes);
      this.cdr.markForCheck();
    }) 

  

  }

  // allow recursive usage: accept nodes as input; if not provided use default mock data
  @Input() nodes?: FolderNode[];
  // nodes loaded from API when input is not provided
  apiNodes: FolderNode[] = [];
  // level 0 = root, level > 0 = nested (subfolder)
  @Input() level: number = 0;
  @Output() refreshTree = new EventEmitter<void>();

  get displayNodes(): FolderNode[] {
    return this.nodes ?? (this.apiNodes.length ? this.apiNodes : []);
  }

  
  // local set used when no shared set is provided by the parent
  private localExpandedIds = new Set<number>();

  /**
   * If provided by a parent instance, children will reuse this shared set so
   * expanded/collapsed state is preserved when parts of the tree are
   * re-created. If not provided, this instance will use its own local set.
   */
  @Input() sharedExpandedIds?: Set<number>;

  // track which node's small-screen actions menu is open
  actionsMenuOpenIds = new Set<number>();
  outsideClickUnlisten?: () => void;

  toggleActionsMenu(event: Event, id: number) {
    // prevent folder toggle
    event.stopPropagation();
    if (this.actionsMenuOpenIds.has(id)) {
      this.actionsMenuOpenIds.delete(id);
    } else {
      this.actionsMenuOpenIds.add(id);
    }
  }

  isActionsMenuOpen(id: number): boolean {
    return this.actionsMenuOpenIds.has(id);
  }

  toggleFolder(event: Event, id: number) {
    event.stopPropagation();
    const set = this.expandedSet;
    if (set.has(id)) {
      set.delete(id);
      return;
    }

    set.add(id);
    const node = this.findNodeById(this.displayNodes, id);
    if (node && node.type === 'folder' && !node.hasLoadedChildren) {
      this.loadNodeChildren(node);
    }
  }

  isExpanded(id: number): boolean {
  return this.expandedSet.has(id);
  }

  onRefreshTree(): void {
   
    if (this.level === 0) {
      this.getCategoriesTree();
      return;
    }
    this.refreshTree.emit();
  }

  private expandFoldersByDefault(nodes: FolderNode[]): void {
    // If a shared set is provided by a parent we must NOT reinitialize it
    // here because that would wipe user-driven state when the child
    // component is recreated. Only initialize defaults when using a local set.
  if (this.sharedExpandedIds) return;
  const target = this.expandedSet;
  target.clear();
  this.collectFolderIds(nodes, target);
  }

  private collectFolderIds(nodes: FolderNode[], target: Set<number>): void {
    for (const node of nodes) {
      if (node.type === 'folder') {
        target.add(node.id);
        if (node.children?.length) {
          this.collectFolderIds(node.children, target);
        }
      }
    }
  }

  /** Return the Set to use for expanded state (shared or local). */
  public get expandedSet(): Set<number> {
    return this.sharedExpandedIds ?? this.localExpandedIds;
  }

  private mapCategoryToNode(category: Category): FolderNode {
    const subcategoryNodes = this.mapSubCategoriesToNodes(category.subcategories ?? [], category);
    const courseNodes = this.mapCoursesToNodes(category.courses ?? []);

    return {
      id: category.id,
      name: category.categoryName,
      type: 'folder',
      nodeType: 'category',
      children: [...subcategoryNodes, ...courseNodes],
      hasLoadedChildren: !!(subcategoryNodes.length || courseNodes.length),
    };
  }

  private mapSubCategoriesToNodes(subcategories: Array<SubCategory | null>, parentCategory: Category): FolderNode[] {
    return subcategories
      .filter((sub): sub is SubCategory => !!sub)
      .map((sub) => ({
        id: sub.id,
        name: sub.subCategoryName,
        type: 'folder',
        nodeType: 'subcategory',
        children: this.mapCoursesToNodes(sub.courses ?? []),
        parent: { id: parentCategory.id, name: parentCategory.categoryName, type: 'folder', nodeType: 'category' },
        hasLoadedChildren: !!(sub.courses?.length),
      }));
  }

  private mapCoursesToNodes(courses: Array<Course | null>): FolderNode[] {
    return courses
      .filter((course): course is Course => !!course)
      .map((course) => ({
        id: course.id,
        name: course.name,
        type: 'file',
        nodeType: 'course',
      }));
  }

  private loadNodeChildren(node: FolderNode): void {
    if (node.nodeType === 'course' || node.type !== 'folder') {
      return;
    }

    node.hasLoadedChildren = true;

    if (node.nodeType === 'category') {
      forkJoin({
        subcategories: this.subCategoryBusiness.getSubCategoriesByCategoryId(node.id),
        courses: this.courseBusiness.getCoursesByCategoryId(node.id),
      }).subscribe({
        next: ({ subcategories, courses }) => {
          const subcategoryNodes = this.mapSubCategoriesToNodes(subcategories ?? [], {
            id: node.id,
            categoryName: node.name,
            categoryDescription: '',
            courses: null,
            subcategories: null,
            categoryImage: undefined,
          } as Category);
          const courseNodes = this.mapCoursesToNodes(courses ?? []);
          node.children = [...subcategoryNodes, ...courseNodes];
          this.cdr.markForCheck();
        },
        error: () => {
          node.hasLoadedChildren = false;
        }
      });
      return;
    }

    if (node.nodeType === 'subcategory') {
      this.courseBusiness.getCoursesBySubCategoryId(node.id).subscribe({
        next: (courses) => {
          node.children = this.mapCoursesToNodes(courses ?? []);
          this.cdr.markForCheck();
        },
        error: () => {
          node.hasLoadedChildren = false;
        }
      });
    }
  }

  editCategory(categoryId:number,level:number) {
    console.log("clicked",categoryId,level)
    if(level == 0)
    this.router.navigate(['categories/edit-category/', categoryId]);
    else
    this.router.navigate(['subcategories/edit-subcategory/', categoryId]);
  }
  
  addCourse(node1: FolderNode) {
    
    const subCategoryId = node1.id??null;
    const categoryId = node1.parent ? node1.parent.id : null;

    //this.router.navigate(['courses/add-course/', categoryId, subCategoryId]);
    this.router.navigate(['courses/add-course'], {
    queryParams: {
      categoryId: categoryId?? subCategoryId ,
      subCategoryId:categoryId? subCategoryId:null
    }
  });
     
  }

  /*
  deleteMainCategory(node1: FolderNode) {

    const categoryId = node1.id;

    const node = this.findNodeById(this.displayNodes, categoryId);
    if (!node) {
      return;
    }
    const category = this.categoriesData.find((c) => c.id === categoryId);
    const hasSubCategories = !!(category?.subcategories && category.subcategories.length > 0);
    const hasCourses = !!(category?.courses && category.courses.length > 0);
    const hasChildren = hasSubCategories || hasCourses || !!(node.children && node.children.length);

    if (!hasChildren) {
      this.deleteCategoryById(categoryId);
      return;
    }

    this.pendingDelete = {
      id: node.id,
      name: node.name,
      type: 'category',
      hasChildren,
      warningKey: hasChildren ? 'FOLDERS_TREE.DELETE_CONFIRM_BLOCKED_CHILDREN' : undefined,
      code: this.generateConfirmationCode(),
      input: '',
      showError: false,
    };
  }
  */

  async deleteMainCategory(node1: FolderNode) {

  const categoryId = node1.id;

  const node = this.findNodeById(this.displayNodes, categoryId);
  if (!node) return;

  const category = this.categoriesData.find(c => c.id === categoryId);

  if (!category) {
    this.toastService.showError(
      this.translate.instant('CATEGORY.DELETE_NOT_FOUND') || 'Not found'
    );
    return;
  }

  const hasSubCategories = !!(category.subcategories && category.subcategories.length > 0);
  const hasCourses = !!(category.courses && category.courses.length > 0);
  const hasChildren = hasSubCategories || hasCourses;

  // 🔹 ALWAYS ask first
  const confirmRes = await Swal.fire({
    html: `
      <span class="swal-confirm-text">
        ${this.translate.instant('CATEGORY.DELETE_CONFIRM_PROMPT', {
          name: `<strong>${node.name}</strong>`
        })}
      </span>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: this.translate.instant('CATEGORY.DELETE_CONFIRM_DELETE') || 'Delete',
    cancelButtonText: this.translate.instant('CATEGORY.DELETE_CONFIRM_CANCEL') || 'Cancel'
  });

  if (!confirmRes.isConfirmed) return;

  // 🔹 If NO content → delete مباشرة
  if (!hasChildren) {
    this.CategoriesBusiness.deleteCategory(categoryId).subscribe({
      next: () => {
        this.onRefreshTree();
        this.toastService.showSuccess(
          this.translate.instant('CATEGORY.DELETE_SUCCESS_MESSAGE')
        );
      },
      error: () => {
        this.toastService.showError(
          this.translate.instant('CATEGORY.DELETE_ERROR_MESSAGE')
        );
      }
    });
    return;
  }

  // 🔹 If HAS content → require code
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const instruction = this.translate.instant(
    'CATEGORY.DELETE_CONFIRM_INSTRUCTION',
    { code }
  );

  const codeRes = await Swal.fire<string>({
    html: `
      <div class="swal-delete-container">
        <p class="swal-delete-instruction">${instruction}</p>
        <input id="confirmCodeInput" class="swal2-input" autocomplete="off" />
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: this.translate.instant('CATEGORY.DELETE_CONFIRM_DELETE'),
    cancelButtonText: this.translate.instant('CATEGORY.DELETE_CONFIRM_CANCEL'),
    preConfirm: () => {
      const inputElement = document.getElementById('confirmCodeInput') as HTMLInputElement;
      const value = inputElement.value;

      if (!value || value !== code) {
        Swal.showValidationMessage(
          this.translate.instant('CATEGORY.DELETE_INVALID_CODE')
        );
        return null;
      }
      return value;
    },
    focusConfirm: false
  });

  if (!codeRes.isConfirmed) return;

  // 🔹 Final delete
  this.CategoriesBusiness.deleteCategory(categoryId).subscribe({
    next: () => {
      this.onRefreshTree();
      this.toastService.showSuccess(
        this.translate.instant('CATEGORY.DELETE_SUCCESS_MESSAGE')
      );
    },
    error: () => {
      this.toastService.showError(
        this.translate.instant('CATEGORY.DELETE_ERROR_MESSAGE')
      );
    }
  });
}

  async deleteCategory(node: FolderNode, level: number) {

  
    if (level === 0) {
      // Category deletion (not implemented here)
      this.deleteMainCategory(node);
    }
    else
    {
      this.deleteSubCategory(node);
    }

  }

  async deleteSubCategory(node1: FolderNode) {
      
    const subCategoryId = node1.id;
    const parentCategoryId = node1.parent?.id;

    const node = this.findNodeById(this.displayNodes, subCategoryId);
    if (!node) {
      return;
    }

    // delete SubCategory flow: find the subcategory from cache first
    let found: SubCategory | undefined;
    
    // Use parent reference to find the subcategory
    if (parentCategoryId) {
      const parentCategory = this.categoriesData.find(c => c.id === parentCategoryId);
      found = parentCategory?.subcategories?.find((s: any) => s && s.id === subCategoryId);
    }

    if (!found) {
      for (const c of this.categoriesData) {
        const sub = (c.subcategories || []).find((s: any) => s && s.id === subCategoryId);
        if (sub) { found = sub; break; }
      }
    }
    
    if (!found) {
      try {
        found = await firstValueFrom(this.subCategoryBusiness.getSubCategoryById(subCategoryId));
      } catch {
        this.toastService.showError(this.translate.instant('SUBCATEGORY.DELETE_NOT_FOUND') || 'Not found');
        return;
      }
    }

    // first, ask for a simple confirmation
    const confirmRes = await Swal.fire({
     html: `
          <span class="swal-confirm-text">
            ${this.translate.instant('SUBCATEGORY.DELETE_CONFIRM_PROMPT', {
              name: `<strong>${node.name}</strong>`
            })}
            
          </span>
        `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('SUBCATEGORY.DELETE_CONFIRM_DELETE') || 'Delete',
      cancelButtonText: this.translate.instant('SUBCATEGORY.DELETE_CONFIRM_CANCEL') || 'Cancel'
    });

    if (!confirmRes.isConfirmed) {
      return; // user cancelled
    }

    // Check if subcategory has courses - fetch courses to determine
    let hasCourses = false;
    try {
      const courses = await firstValueFrom(this.courseBusiness.getCoursesBySubCategoryId(subCategoryId));
      hasCourses = !!(courses && courses.length > 0);
    } catch {
      // If API fails, assume no courses to avoid blocking delete
      hasCourses = false;
    }
    
    if (!hasCourses) {
      // No courses, proceed directly to delete
      this.subCategoryBusiness.deleteSubCategory(subCategoryId).subscribe({
        next: () => {
          this.onRefreshTree();
          this.toastService.showSuccess(this.translate.instant('SUBCATEGORY.DELETE_SUCCESS_MESSAGE'));
        },
        error: () => {
          this.toastService.showError(this.translate.instant('SUBCATEGORY.DELETE_ERROR_MESSAGE'));
        }
      });
      return;
    }

    // Has courses - generate confirmation code and show separate dialog to enter it
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const instruction = this.translate.instant('SUBCATEGORY.DELETE_CONFIRM_INSTRUCTION', { code });

    const codeRes = await Swal.fire<string>({
      html: `  <div class="swal-delete-container">
              <p class="swal-delete-instruction">${instruction}</p>
                <input id="confirmCodeInput" class="swal2-input" autocomplete="off" />
              </div>`,
      inputPlaceholder: this.translate.instant('SUBCATEGORY.ENTER_CONFIRM_CODE') ,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('SUBCATEGORY.DELETE_CONFIRM_DELETE') ,
      cancelButtonText: this.translate.instant('SUBCATEGORY.DELETE_CONFIRM_CANCEL') ,
      preConfirm: () => {

            const inputElement = document.getElementById('confirmCodeInput') as HTMLInputElement;
            const value = inputElement.value;

        if (!value || value.toString() !== code) {
          Swal.showValidationMessage(this.translate.instant('SUBCATEGORY.DELETE_INVALID_CODE'));
          return null;
        }
        return value;
      },
      focusConfirm: false
    });

    if (!codeRes.isConfirmed) return;

    // proceed to delete SubCategory
    this.subCategoryBusiness.deleteSubCategory(subCategoryId).subscribe({
      next: () => {
        this.onRefreshTree();
        this.toastService.showSuccess(this.translate.instant('SUBCATEGORY.DELETE_SUCCESS_MESSAGE'));
      },
      error: () => {
        this.toastService.showError(this.translate.instant('SUBCATEGORY.DELETE_ERROR_MESSAGE'));
      }
    });
  
}

editCourse(courseId:number) {
  console.log("clicked",courseId)
    this.router.navigate(['courses/edit-course/', courseId]);
  }

 /*
async deleteCourse(node1: FolderNode) {

  const courseId = node1.id;
  const node = this.findNodeById(this.displayNodes, courseId);

  if (!node) return;

  this.courseBusiness.getCourseById(courseId).subscribe({
    next: async (course) => {

      const hasLearningUnits = !!(course?.learning_units && course.learning_units.length > 0);

      // ❌ إذا عنده Learning Units → لا تحذف
      if (hasLearningUnits) {
        this.toastService.showError(
          this.translate.instant('COURSE.DELETE_BLOCKED_HAS_LEARNING_UNITS')
        );
        return;
      }

      // ✅ نفس dialog المستخدم في subcategory
      const confirmRes = await Swal.fire({
        html: `
          <span class="swal-confirm-text">
            ${this.translate.instant('SUBCATEGORY.DELETE_CONFIRM_PROMPT', {
              name: `<strong>${node.name}</strong>`
            })}
          </span>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText:
          this.translate.instant('SUBCATEGORY.DELETE_CONFIRM_DELETE') || 'Delete',
        cancelButtonText:
          this.translate.instant('SUBCATEGORY.DELETE_CONFIRM_CANCEL') || 'Cancel'
      });

      if (!confirmRes.isConfirmed) return;

      // ✅ تنفيذ الحذف
      this.courseBusiness.deleteCourse(courseId).subscribe({
        next: () => {
          this.onRefreshTree();
          this.toastService.showSuccess(
            this.translate.instant('COURSE.DELETE_SUCCESS_MESSAGE')
          );
        },
        error: () => {
          this.toastService.showError(
            this.translate.instant('COURSE.DELETE_ERROR_MESSAGE')
          );
        }
      });

    },
    error: () => {
      this.toastService.showError(
        this.translate.instant('COURSE.DELETE_ERROR_MESSAGE')
      );
    }
  });
}
*/

async deleteCourse(node1: FolderNode) {

  const courseId = node1.id;
  const node = this.findNodeById(this.displayNodes, courseId);

  if (!node) return;

  this.courseBusiness.getCourseById(courseId).subscribe({
    next: async (course) => {

      const hasLearningUnits = !!(course?.learning_units && course.learning_units.length > 0);

      // ✅ first confirmation (same as subcategory)
      const confirmRes = await Swal.fire({
        html: `
          <span class="swal-confirm-text">
            ${this.translate.instant('SUBCATEGORY.DELETE_CONFIRM_PROMPT', {
              name: `<strong>${node.name}</strong>`
            })}
          </span>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText:
          this.translate.instant('SUBCATEGORY.DELETE_CONFIRM_DELETE') || 'Delete',
        cancelButtonText:
          this.translate.instant('SUBCATEGORY.DELETE_CONFIRM_CANCEL') || 'Cancel'
      });

      if (!confirmRes.isConfirmed) return;

      // ✅ إذا ما عنده learning units → حذف مباشر
      if (!hasLearningUnits) {
        this.courseBusiness.deleteCourse(courseId).subscribe({
          next: () => {
            this.onRefreshTree();
            this.toastService.showSuccess(
              this.translate.instant('COURSE.DELETE_SUCCESS_MESSAGE')
            );
          },
          error: () => {
            this.toastService.showError(
              this.translate.instant('COURSE.DELETE_ERROR_MESSAGE')
            );
          }
        });
        return;
      }

      // 🔐 عنده learning units → اطلب confirmation code
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();

      const instruction = this.translate.instant(
        'COURSE.DELETE_CONFIRM_INSTRUCTION',
        { code }
      );

      const codeRes = await Swal.fire<string>({
        html: `
          <div class="swal-delete-container">
            <p class="swal-delete-instruction">${instruction}</p>
            <input id="confirmCodeInput" class="swal2-input" autocomplete="off" />
          </div>
        `,
        inputPlaceholder: this.translate.instant('COURSE.ENTER_CONFIRM_CODE'),
        showCancelButton: true,
        confirmButtonText: this.translate.instant('SUBCATEGORY.DELETE_CONFIRM_DELETE'),
        cancelButtonText: this.translate.instant('SUBCATEGORY.DELETE_CONFIRM_CANCEL'),
        preConfirm: () => {

          const inputElement = document.getElementById('confirmCodeInput') as HTMLInputElement;
          const value = inputElement.value;

          if (!value || value.toString() !== code) {
            Swal.showValidationMessage(
              this.translate.instant('COURSE.DELETE_INVALID_CODE')
            );
            return null;
          }

          return value;
        },
        focusConfirm: false
      });

      if (!codeRes.isConfirmed) return;

      // ✅ delete after correct code
      this.courseBusiness.deleteCourse(courseId).subscribe({
        next: () => {
          this.onRefreshTree();
          this.toastService.showSuccess(
            this.translate.instant('COURSE.DELETE_SUCCESS_MESSAGE')
          );
        },
        error: () => {
          this.toastService.showError(
            this.translate.instant('COURSE.DELETE_ERROR_MESSAGE')
          );
        }
      });

    },
    error: () => {
      this.toastService.showError(
        this.translate.instant('COURSE.DELETE_ERROR_MESSAGE')
      );
    }
  });
}


private deleteCourseById(courseId: number): void {

  this.deleteInProgress = true;
  
  this.courseBusiness.deleteCourse(courseId).subscribe({
    next: () => {
      this.pendingDelete = null;
      this.deleteInProgress = false;
      this.onRefreshTree();
      this.toastService.showSuccess(this.translate.instant('COURSE.DELETE_SUCCESS_MESSAGE'));
    },
    error: () => {
      this.deleteInProgress = false;
      if (this.pendingDelete) {
        this.pendingDelete.showError = true;
      }
      this.toastService.showError(this.translate.instant('COURSE.DELETE_ERROR_MESSAGE'));
    }
  });
}

 deleteNode(nodes: FolderNode[], id: number): FolderNode[] {
  return nodes
    .filter(node => node.id !== id) // remove node at this level
    .map(node => ({
      ...node,
      children: node.children ? this.deleteNode(node.children, id) : [],
    }));
}



  addSubCategory(parentId: number) {
    // navigate to add subcategory page with parentId as route param or query param
    this.router.navigate(['subcategories/add-subcategory', parentId]); // using route param
  }

  cancelDelete() {
    this.pendingDelete = null;
    this.deleteInProgress = false;
  }

  confirmDelete(): Promise<boolean> {
    if (!this.pendingDelete || this.deleteInProgress) {
      return Promise.resolve(false);
    }
    if (this.pendingDelete.input !== this.pendingDelete.code) {
      this.pendingDelete.showError = true;
      return Promise.resolve(false);
    }

    if (this.pendingDelete.type === 'course') {
      this.deleteCourseById(this.pendingDelete.id);
    } else {
      this.deleteCategoryById(this.pendingDelete.id);
    }
    return Promise.resolve(true);
  }

  private deleteCategoryById(categoryId: number): void {
    this.deleteInProgress = true;
    this.CategoriesBusiness.deleteCategory(categoryId).subscribe({
      next: () => {
        this.pendingDelete = null;
        this.deleteInProgress = false;
        this.onRefreshTree();
      },
      error: () => {
        this.deleteInProgress = false;
        if (this.pendingDelete) {
          this.pendingDelete.showError = true;
        }
      },
    });
  }

  private generateConfirmationCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i += 1) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  findNodeById(nodes: FolderNode[], id: number): FolderNode | null {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children?.length) {
        const found = this.findNodeById(node.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
addCategory() {
    this.router.navigate(['categories/add-category']);
  }
  goToCourse(id: number, name: string) {
    this.router.navigate(['/learningUnits/AlllearningUnits', id], { queryParams: { courseName: name } });
  }
}

