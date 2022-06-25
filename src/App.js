import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from "./pages/home/Home";
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
import Linkedin from "./pages/Linkedin/Linkedin";
import Locations from "./pages/Locations/Locations";
import NewLocation from "./pages/Locations/NewLocation";
import Interviews from "./pages/Interviews/Interviews";
import AddAndUpdateInterview from "./pages/Interviews/AddAndUpdateInterview";
import Books from "./pages/Books/Books";
import NewBook from "./pages/Books/NewBook";
import UpdateBook from "./pages/Books/UpdateBook";
import Articles from "./pages/Articles/Articles";
import AddAndUpdateArticle from "./pages/Articles/AddAndUpdateArticle";
import NewArticle from "./pages/Articles/NewArticle";
import UpdateArticle from "./pages/Articles/UpdateArticle";

function App() {
  return (
    <div className="dgt-app-container">
      <div className="dgt-app-loader app-loader">
        <div className="loadersmall"></div>
      </div>

      <Router>

        <Route exact path="/" component={Articles} />

        {/* Courses */}
        <Route path="/courses/update/:id" component={UpdateCourse} />
        <Route exact path="/courses" component={Courses} />
        <Route path="/newcourse" component={NewCourse} />

        {/* Category */}
        <Route exact path="/categories/update/:id" component={AddAndUpdateCategory} />
        <Route exact path="/categories/create" component={AddAndUpdateCategory} />
        <Route exact path="/categories" component={Categories} />

        {/* Career Advisors */}
        <Route exact path="/advisors/update/:id" component={UpdateAdvisor} />
        <Route path="/newadvisor" component={NewAdvisor} />
        <Route exact path="/advisors" component={Advisors} />

        {/* Newsletter Subscriptions */}
        <Route path="/subscriptions" component={NewsSubscriptions} />

        {/* Contact Us Messages */}
        <Route path="/messages" component={ContactUsMessages} />

        {/* LinkedIn Optimization */}
        <Route path="/linkedin" component={Linkedin} />

        {/* Office Locations */}
        <Route path="/locations" component={Locations} />
        <Route exact path="/newlocation" component={NewLocation} />

        {/* <Route path={"/map"} component={MapLocation} /> */}
        {/* Interviews */}
        <Route exact path="/interviews/update/:id" component={AddAndUpdateInterview} />
        <Route exact path="/interviews/create" component={AddAndUpdateInterview} />
        <Route path="/interviews" component={Interviews} />

        {/* Author */}
        <Route path="/books/update/:id" component={UpdateBook} />
        <Route exact path="/books" component={Books} />
        <Route path="/newbook" component={NewBook} />

        {/* Articles */}
        <Route exact path="/new-article" component={NewArticle} />
        <Route exact path="/articles/update/:id" component={UpdateArticle} />
        <Route exact path="/articles" component={Articles} />

      </Router >
    </div>
  );
}

export default App;