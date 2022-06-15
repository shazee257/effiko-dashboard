import Login from "./pages/Login/Login";
import Signup from './pages/Register/Signup';
import "./App.css";
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Route } from "react-router-dom";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";





import PackagingList from "./pages/packagingList/PackagingList";
import GroupedOrderList from "./pages/orderList/GroupedOrderList";
import OrderList from "./pages/orderList/OrderList";
import Order from "./pages/order/order";
import CalendarEvents from "./pages/calendar/Calendar"
import ReviewList from "./pages/reviewList/ReviewList";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import ConsumerPage from "./pages/consumerPage/ConsumerPage";
import CheckoutPage from "./pages/checkoutPage/CheckoutPage";
import Shop from "./pages/shop/Shop";
import Settings from "./pages/settings/Settings";
import HostCalendar from "./pages/hostCalendar/HostCalendar";
import Profile from "./pages/profile/Profile";
import SubscriptionAcceptance from "./pages/subscriptionAcceptance/SubscriptionAcceptance";
import GroupBuyList from "./pages/groupBuyList/GroupBuyList";


import Courses from "./pages/Courses/Courses";
import NewCourse from "./pages/Courses/NewCourse";
import UpdateCourse from "./pages/Courses/UpdateCourse";
import Categories from "./pages/Categories/Categories";
import AddAndUpdateCategory from "./pages/Categories/AddAndUpdateCategory";
import Advisors from "./pages/Advisors/Advisors";
import NewAdvisor from "./pages/Advisors/NewAdvisor";
import UpdateAdvisor from "./pages/Advisors/UpdateAdvisor";
import NewsSubscriptions from "./pages/NewsSubscriptions/NewsSubscriptions";
import ContactUsMessages from "./pages/ContactUsMessages/ContactUsMessages";


function App() {
  return (
    <div className="dgt-app-container">
      <div className="dgt-app-loader app-loader">
        <div className="loadersmall"></div>
      </div>

      <Router>
        {/* Courses */}
        <Route path="/courses/update/:id" component={UpdateCourse} />
        <Route exact path="/courses" component={Courses} />
        <Route path="/newcourse" component={NewCourse} />

        {/* Category */}
        <Route exact path="/categories/update/:id" component={AddAndUpdateCategory} />
        <Route exact path="/categories/create" component={AddAndUpdateCategory} />
        <Route path="/categories" component={Categories} />

        {/* Career Advisors */}
        <Route path="/advisors/update/:id" component={UpdateAdvisor} />
        <Route path="/newadvisor" component={NewAdvisor} />
        <Route path="/advisors" component={Advisors} />

        {/* Newsletter Subscriptions */}
        <Route path="/subscriptions" component={NewsSubscriptions} />

        {/* Contact Us Messages */}
        <Route path="/messages" component={ContactUsMessages} />





        <Route path="/shop/:hostSlug" component={ConsumerPage} />
        <Route path="/checkout/:merchantId" component={CheckoutPage} />
        <Route path="/settings" component={Settings} />
        <Route path="/profile" component={Profile} />
        <Route path="/host-calender" component={HostCalendar} />

        <Route exact path="/" component={Home} />





        <Route path="/group-buy/update/:groupBuyId" component={SubscriptionAcceptance} />

        <Route path="/group-buys" component={GroupBuyList} />




        {/* Each Product Details */}



        {/* <Route path="/product/:productId" component={Product} /> */}

        <Route path="/packaging" component={PackagingList} />

        {/* <Route path="/grouped-orders" component={GroupedOrderList} /> */}
        <Route exact path="/orders" component={GroupedOrderList} />
        <Route exact path="/orders/:userId/:groupBuyDate" component={OrderList} />
        <Route path="/order/:orderId" component={Order} />

        <Route path="/calendar" component={CalendarEvents} />
        <Route path="/reviews" component={ReviewList} />
        <Route path="/forgotpassword" component={ForgotPassword} />
        <Route path="/reset/:resetToken" component={ResetPassword} />


        <Route path="/users" component={UserList} />
        <Route path="/user/:userId" component={User} />
        <Route path="/newUser" component={NewUser} />

      </Router >
    </div>
  );
}

export default App;