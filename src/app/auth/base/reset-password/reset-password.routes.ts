import { Routes } from "@angular/router";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { StepPasswordComponent } from "../register/components/step-password/step-password.component";

export const resetPasswordRoutes: Routes = [
    {
        path: '',
        component: ForgotPasswordComponent,
        data: {
            title: 'Esqueceu sua senha?',
            subtitle: 'Digite seu CNPJ ou CPF'
        }
    },
    {
        path: 'new-password',
        component: StepPasswordComponent,
        data: {
            title: 'Resetar senha',
            subtitle: 'Digite sua nova senha'
        }
    }
]