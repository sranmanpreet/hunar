import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { GalleryOfArtComponent } from './gallery/gallery-of-art/gallery-of-art.component';
import { OrderComponent } from './order/order.component';
import { ShoppingCartComponent } from './shopping/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './shopping/checkout/checkout.component';
import { AddressResolverService } from './shopping/checkout/address-resolver.service';
import { GalleryProductResolverService } from './gallery/gallery-product-resolver.service';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuard } from './authentication/auth.guard';
import { ShoppingCartResolverService } from './shopping/shopping-cart/shopping-cart-resolver.service';
import { ShippingAddressComponent } from './shopping/shipping-address/shipping-address.component';
import { OrderReviewComponent } from './shopping/order-review/order-review.component';
import { OrderConfirmationComponent } from './shopping/order-confirmation/order-confirmation.component';
import { PaymentComponent } from './shopping/payment/payment.component';
import { CountryResoverService } from './shopping/shipping-address/country.resolver';
import { OrderConfirmationGuard } from './order/order-confirmation.guard';
import { MyOrdersComponent } from './order/my-orders/my-orders.component';
import { MyOrdersResolver } from './order/my-orders.resolver';
import { SupportRequestsComponent } from './support-requests/support-requests.component';
import { SupportRequestResolver } from './support-requests/support-request.resolver';
import { AdvertisementsComponent } from './advertisements/advertisements.component';
import { AdvertisementsResolver } from './advertisements/advertisements.resolver';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbackResolver } from './feedback/feedback.resolver';
import { MakeToOrderComponent } from './order/make-to-order/make-to-order.component';
import { AdvertiseComponent } from './order/advertise/advertise.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ForgotPasswordResetComponent } from './authentication/forgot-password-reset/forgot-password-reset.component';
import { ProductComponent } from './gallery/product/product.component';
import { AddProductComponent } from './admin/add-product/add-product.component';

const routes: Routes = [
  { path: '', component: HomeComponent, resolve: { products: GalleryProductResolverService } },
  { path: 'sign-in', component: LoginComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ForgotPasswordResetComponent },
  { path: 'userprofile', component: UserProfileComponent, canActivate: [AuthGuard], resolve: { addresses: AddressResolverService } },
  
  { path: 'administration/add-product', component: AddProductComponent },
  
  {
    path: 'support-requests',
    component: SupportRequestsComponent,
    resolve: { requests: SupportRequestResolver },
    canActivate: [AuthGuard]
  },
  {
    path: 'advertisements',
    component: AdvertisementsComponent,
    resolve: { requests: AdvertisementsResolver },
    canActivate: [AuthGuard]
  },
  {
    path: 'feedbacks',
    component: FeedbackComponent,
    resolve: { requests: FeedbackResolver },
    canActivate: [AuthGuard]
  },
  { path: 'gallery-of-art', component: GalleryOfArtComponent, resolve: { products: GalleryProductResolverService } },
  {
    path: 'order', component: OrderComponent, children: [
      {
        path: 'exclusive-arts', component: MakeToOrderComponent
      },
      { path: 'gallery-of-art', component: GalleryOfArtComponent, resolve: { products: GalleryProductResolverService } },
      { path: 'gallery-of-art/:id', component: ProductComponent, resolve: { products: GalleryProductResolverService } },
      { path: 'advertise', component: AdvertiseComponent }
    ]
  },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent, resolve: { cart: ShoppingCartResolverService } },
  { path: 'my-orders', component: MyOrdersComponent, resolve: { orders: MyOrdersResolver }, canActivate: [AuthGuard] },
  {
    path: 'checkout', component: CheckoutComponent, children: [
      {
        path: 'address', component: ShippingAddressComponent,
        resolve: { countries: CountryResoverService, addresses: AddressResolverService },
        canActivate: [AuthGuard]
      },
      {
        path: 'order-summary',
        component: OrderReviewComponent,
        canActivate: [AuthGuard]
      },
      { path: 'payment', component: PaymentComponent },
      {
        path: 'order-confirmation',
        component: OrderConfirmationComponent,
        canActivate: [OrderConfirmationGuard]/* , resolve: { order: OrderConfirmationResolverService }  */
      },
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'disabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
