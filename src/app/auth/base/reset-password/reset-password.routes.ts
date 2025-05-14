import { Routes } from "@angular/router";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { StepPasswordComponent } from "../register/components/step-password/step-password.component";
import { ResetPasswordGuard } from "@auth/guards/reset-password.guard";
import { ForgotPasswordGuard } from "@auth/guards/forgot-password.guard";

export const resetPasswordRoutes: Routes = [
    {
        path: '',
        component: ForgotPasswordComponent,
        canActivate: [ForgotPasswordGuard],
        data: {
            title: 'Esqueceu sua senha?',
            subtitle: 'Digite seu CNPJ ou CPF'
        }
    },
    {
        path: 'new-password',
        component: StepPasswordComponent,
        canActivate: [ResetPasswordGuard],
        data: {
            title: 'Resetar senha',
            subtitle: 'Digite sua nova senha'
        }
    }
]
