import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StudentProfileStateService } from 'src/app/shared/services/StudentProfileState.service';

export const EditProfileGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const profileStore = inject(StudentProfileStateService);
    const student = profileStore.student();
    if (!student) {
        router.navigate(['/profile-student']);
        return false;
    }
    return true;
};
