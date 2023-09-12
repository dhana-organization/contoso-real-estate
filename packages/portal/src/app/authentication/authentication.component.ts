import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry, MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../shared/authentication/auth.service";
import { TextBlockComponent } from "../shared/text-block/text-block.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faApple, faFacebook, faGithub, faGoogle, faMicrosoft, faTwitter } from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: "app-authentication",
  templateUrl: "./authentication.component.html",
  styleUrls: ["./authentication.component.scss"],
  imports: [CommonModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, TextBlockComponent, MatIconModule,FontAwesomeModule],
  standalone: true,
})
export class AuthenticationComponent implements OnInit {
  public constructor(iconRegistry: MatIconRegistry, santizer: DomSanitizer) {
    for (const provider of this.providers) {
      iconRegistry.addSvgIcon(provider.id, santizer.bypassSecurityTrustResourceUrl(`../assets/company-logos/${provider.id}.svg`));
    }
  }

  redirectURL = "/home";
  providers = [
    { name: "Microsoft", id: "microsoft", icon: faFacebook },
    { name: "Facebook", id: "facebook", icon: faMicrosoft },
    { name: "Google", id: "google", icon: faGoogle },
    { name: "Twitter", id: "twitter", icon: faTwitter },
    { name: "GitHub", id: "github", icon: faGithub },
    { name: "Apple", id: "apple", icon: faApple }
  ];
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  async ngOnInit() {
    const params = this.route.snapshot.queryParams;
    if (params["redirectURL"]) {
      this.redirectURL = params["redirectURL"];
    }

    if (this.isAuthenticated()) {
      this.router.navigate([this.redirectURL]);
    }
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  loginWith(provider: string) {
    return `/.auth/login/${provider}?post_login_redirect_uri=` + this.redirectURL;
  }
}
