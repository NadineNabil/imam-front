import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
  standalone: false
})
export class ReportComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.initSidebarToggle();
    this.initScrollSpy();
    this.initRevealOnScroll();
    this.initCounters();
  }

  private initSidebarToggle(): void {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const burger = document.getElementById('burgerBtn');

    if (!sidebar || !overlay || !burger) return;

    const openSidebar = (): void => {
      sidebar.classList.add('open');
      overlay.classList.add('show');
    };

    const closeSidebar = (): void => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    };

    burger.addEventListener('click', openSidebar);
    overlay.addEventListener('click', closeSidebar);

    const navLinks: NodeListOf<HTMLAnchorElement> = sidebar.querySelectorAll('a[data-nav]');
    navLinks.forEach((link: HTMLAnchorElement) => {
      link.addEventListener('click', closeSidebar);
    });
  }

  private initScrollSpy(): void {
    const navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('a[data-nav]');
    const breadcrumb = document.getElementById('breadcrumb');

    if (navLinks.length === 0) return;

    const sectionIds: string[] = Array.from(navLinks).map((link) =>
      link.getAttribute('href')?.replace('#', '') ?? ''
    );

    const sections: HTMLElement[] = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const setActive = (id: string): void => {
      navLinks.forEach((link: HTMLAnchorElement) => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isActive);
        if (isActive && breadcrumb) {
          breadcrumb.textContent = link.textContent?.trim() ?? '';
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section: HTMLElement) => observer.observe(section));
  }

  private initRevealOnScroll(): void {
    const revealEls: NodeListOf<HTMLElement> = document.querySelectorAll('.reveal');

    if (revealEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[], obs: IntersectionObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el: HTMLElement) => observer.observe(el));
  }

  private initCounters(): void {
    const counters: NodeListOf<HTMLElement> = document.querySelectorAll('.report-stat__value[data-target]');

    if (counters.length === 0) return;

    const animate = (el: HTMLElement): void => {
      const target: number = parseInt(el.dataset.target ?? '0', 10);
      const duration = 900;
      const start = performance.now();

      const step = (now: number): void => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.round(eased * target));
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = String(target);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[], obs: IntersectionObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target as HTMLElement);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((el: HTMLElement) => observer.observe(el));
  }
}
