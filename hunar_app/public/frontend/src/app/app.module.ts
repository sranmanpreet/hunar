import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClientXsrfModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './error-pages/page-not-found/page-not-found.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FooterComponent } from './footer/footer.component';
import { OrderComponent } from './order/order.component';
import { GalleryOfArtComponent } from './gallery/gallery-of-art/gallery-of-art.component';
import { MakeToOrderComponent } from './order/make-to-order/make-to-order.component';
import { AdvertiseComponent } from './order/advertise/advertise.component';
import { HeaderService } from './shared/services/header.service';
import { ShoppingCartComponent } from './shopping/shopping-cart/shopping-cart.component';
import { GalleryOfArtItemComponent } from './gallery/gallery-of-art-item/gallery-of-art-item.component';
import { GalleryItemCartComponent } from './gallery/gallery-item-cart/gallery-item-cart.component';
import { CheckoutComponent } from './shopping/checkout/checkout.component';
import { PaymentComponent } from './shopping/payment/payment.component';
import { OrderReviewComponent } from './shopping/order-review/order-review.component';
import { ShippingAddressComponent } from './shopping/shipping-address/shipping-address.component';
import { AddressResolverService } from './shopping/checkout/address-resolver.service';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuard } from './authentication/auth.guard';
import { AuthInterceptor } from './authentication/auth.interceptor';
import { OrderConfirmationComponent } from './shopping/order-confirmation/order-confirmation.component';
import { MyOrdersComponent } from './order/my-orders/my-orders.component';
import { SupportRequestsComponent } from './support-requests/support-requests.component';
import { AdvertisementsComponent } from './advertisements/advertisements.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ForgotPasswordResetComponent } from './authentication/forgot-password-reset/forgot-password-reset.component';
import { ConfirmEqualValidatorDirective } from './authentication/confirm-equal-validator.directive';
import { ProductComponent } from './gallery/product/product.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { AllProductsComponent } from './admin/all-products/all-products.component';
import { PricingComponent } from './admin/pricing/pricing.component';
import { ArtTypeSizeComponent } from './admin/art-type-size/art-type-size.component';
import { XsrfInterceptor } from './authentication/xsrf.interceptor';
import { UnauthorizedComponent } from './error-pages/unauthorized/unauthorized.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    PageNotFoundComponent,
    ContactUsComponent,
    FooterComponent,
    OrderComponent,
    GalleryOfArtComponent,
    MakeToOrderComponent,
    AdvertiseComponent,
    ShoppingCartComponent,
    GalleryOfArtItemComponent,
    GalleryItemCartComponent,
    CheckoutComponent,
    ShippingAddressComponent,
    PaymentComponent,
    OrderReviewComponent,
    UserProfileComponent,
    OrderConfirmationComponent,
    MyOrdersComponent,
    SupportRequestsComponent,
    AdvertisementsComponent,
    FeedbackComponent,
    AboutUsComponent,
    ForgotPasswordComponent,
    ForgotPasswordResetComponent,
    ConfirmEqualValidatorDirective,
    ProductComponent,
    AddProductComponent,
    AllProductsComponent,
    PricingComponent,
    ArtTypeSizeComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions(),
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  entryComponents: [
    GalleryItemCartComponent
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: XsrfInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }, AuthGuard, HeaderService, AddressResolverService, CookieService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
