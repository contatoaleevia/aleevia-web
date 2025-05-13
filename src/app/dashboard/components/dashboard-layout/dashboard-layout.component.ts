import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessProfilesComponent } from '../access-profiles/access-profiles.component';
import { AccessProfilesData } from '../access-profiles/access-profiles.model';
import { AiAssistantComponent } from '../ai-assistant/ai-assistant.component';
import { CategoriesChartComponent } from '../categories-chart/categories-chart.component';
import { CategoriesChartData } from '../categories-chart/categories-chart.model';
import { ClinicCardComponent } from '../clinic-card/clinic-card.component';
import { ClinicCardData } from '../clinic-card/clinic-card.model';
import { InteractionsChartComponent } from '../interactions-chart/interactions-chart.component';
import { InteractionsChartData } from '../interactions-chart/interactions-chart.model';
import { ReferralGaugeComponent } from '../referral-gauge/referral-gauge.component';
import { ReferralGaugeData } from '../referral-gauge/referral-gauge.model';
import { SatisfactionRatingComponent } from '../satisfaction-rating/satisfaction-rating.component';
import { SatisfactionRatingData } from '../satisfaction-rating/satisfaction-rating.model';
import { StatisticsCardComponent } from '../statistics-card/statistics-card.component';
import { StatisticsCardData } from '../statistics-card/statistics-card.model';
import { AuthService } from '@auth/services/auth.service';
import { User } from '@shared/models/user.model';


@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    ClinicCardComponent,
    AccessProfilesComponent,
    ReferralGaugeComponent,
    SatisfactionRatingComponent,
    CategoriesChartComponent,
    StatisticsCardComponent,
    InteractionsChartComponent,
    AiAssistantComponent
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent implements OnInit {
  private readonly authService = inject(AuthService);

  currentUser: User = {} as User;
  shouldShowProfessionals = false;

  clinicCardData: ClinicCardData = {
    title: 'Medical Clinic',
    logo: 'assets/images/logo-aleevia.png',
    items: [
      {
        icon: 'bi bi-robot',
        label: 'Minha assistente virtual',
        link: 'https://aleevia.com/assistente-virtual',
      },
      {
        icon: 'bi bi-person-plus',
        label: 'Profissionais',
        count: 25,
        description: 'cadastrados',
        route: '/professionals'
      },
      {
        icon: 'bi bi-clipboard2-pulse',
        label: 'Serviços',
        count: 32,
        description: 'serviços disponíveis',
        route: '/attendances'
      },
      {
        icon: 'bi bi-question-circle',
        label: 'Central de ajuda',
        count: 26,
        description: 'artigos publicados',
        route: '/faq'
      },
      {
        icon: 'bi bi-people',
        label: 'Convênios',
        count: 3,
        description: 'convênios ativos',
      }
    ]
  };

  accessProfilesData: AccessProfilesData = {
    title: 'Perfis de acesso',
    profiles: [
      {
        name: 'Joana da Silva',
        role: 'Médico',
        isActive: true
      },
      {
        name: 'Joana da Silva',
        role: 'Assistente',
        isActive: true
      },
      {
        name: 'Joana da Silva',
        role: 'Financeiro',
        isActive: true
      }
    ]
  };

  referralGaugeData: ReferralGaugeData = {
    title: 'Taxa de encaminhamento',
    subtitle: 'Atendimento humano',
    percentage: 72,
    description: 'Atendimento via Chat'
  };

  satisfactionRatingData: SatisfactionRatingData = {
    ratings: [
      {
        score: 4.9,
        maxScore: 5.0,
        totalRatings: 176,
        trend: 15.8,
        label: 'Sobre atendimento'
      },
      {
        score: 4.5,
        maxScore: 5.0,
        totalRatings: 234,
        trend: 8.60,
        label: 'Sobre entrega'
      }
    ]
  };

  categoriesChartData: CategoriesChartData = {
    title: 'Categorias mais visualizadas',
    total: 46,
    categories: [
      {
        name: 'Clínica',
        count: 28,
        percentage: 62.5,
        color: '#3B82F6'
      },
      {
        name: 'Horário Atendimento',
        count: 12,
        percentage: 26,
        color: '#F59E0B'
      },
      {
        name: 'Procedimentos',
        count: 6,
        percentage: 12.5,
        color: '#10B981'
      }
    ]
  };

  statisticsCardData: StatisticsCardData = {
    month: 'Abril/25',
    items: [
      {
        title: 'Número de pacientes',
        subtitle: 'Únicos atendidos',
        value: '1,250',
        trend: 15.80
      },
      {
        title: 'Frequência média de uso',
        subtitle: 'Interações/Paciente (única)',
        value: '1,180',
        trend: -4.90,
        isNegativeTrendGood: false
      }
    ]
  };

  interactionsChartData: InteractionsChartData = {
    title: 'Interações',
    subtitle: 'Últimos meses',
    totalLabel: 'total',
    totalValue: '1,480',
    data: [
      { month: 'Apr', value: 850 },
      { month: 'May', value: 920 },
      { month: 'Jun', value: 990 },
      { month: 'Jul', value: 1200 },
      { month: 'Aug', value: 1050 },
      { month: 'Sep', value: 980 },
      { month: 'Oct', value: 1100 },
      { month: 'Nov', value: 950 },
      { month: 'Dec', value: 1150 }
    ]
  };

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser!;
    this.shouldShowProfessionals = this.currentUser?.user_type === '2';

    if (!this.shouldShowProfessionals) {
      this.clinicCardData.items = this.clinicCardData.items.filter(item => item.label !== 'Profissionais');
    }
  }
}
