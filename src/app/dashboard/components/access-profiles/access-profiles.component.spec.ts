import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessProfilesComponent } from './access-profiles.component';
import { AccessProfilesData } from './access-profiles.model';

describe('AccessProfilesComponent', () => {
  let component: AccessProfilesComponent;
  let fixture: ComponentFixture<AccessProfilesComponent>;
  const mockProfilesData: AccessProfilesData = {
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
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessProfilesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AccessProfilesComponent);
    component = fixture.componentInstance;
    component.profilesData = mockProfilesData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const titleElement = fixture.nativeElement.querySelector('.title');
    expect(titleElement.textContent).toContain('Perfis de acesso');
  });

  it('should display the correct number of profiles', () => {
    const profileItems = fixture.nativeElement.querySelectorAll('.profile-item');
    expect(profileItems.length).toBe(2);
  });

  it('should have a "Ver todos" button', () => {
    const viewAllButton = fixture.nativeElement.querySelector('.view-all');
    expect(viewAllButton.textContent.trim()).toBe('Ver todos');
  });
});
