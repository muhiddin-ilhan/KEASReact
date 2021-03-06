import './App.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginView from './view/login/login_view';
import PageConstant from './constant/page_constant';
import HomeView from './view/home/home_view';
import UsersView from './view/users/users_view';
import UserTaskView from './view/users/user_task_view';
import RegisterView from './view/register/register_view';
import UserEditView from './view/users/users_edit_view';
import TrucksView from './view/truck/trucks_view';
import TrucksEditView from './view/truck/trucks_edit_view';
import UserAddView from './view/users/users_add_view';
import TrucksAddView from './view/truck/trucks_add_view';
import VendorsView from './view/vendor/vendors_view';
import VendorAddView from './view/vendor/vendor_add_view';
import VendorEditView from './view/vendor/vendor_edit_view';
import FactoriesView from './view/factory/factories_view';
import FactoryAddView from './view/factory/factory_add_view';
import FactoryEditView from './view/factory/factory_edit_view';
import TaskView from './view/task/task_view';
import TaskAddView from './view/task/task_add_view';
import TaskEditView from './view/task/task_edit_view';
import TaskAssignView from './view/task/task_assign_view';
import AssignedTaskView from './view/task/assigned_task_view';
import AssignedTaskDetailView from './view/task/assigned_task_detail_view';
import TaskRouteMapView from './view/map/task_route_map_view';
import DangerAreaAddView from './view/areas/danger_area_add_view';
import DangerAreasView from './view/areas/danger_areas_view';
import FactoryTaskView from './view/factory/factory_task_view';
import FactoriesEntryView from './view/factory/factories_entry_view';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path={PageConstant.MAIN_PAGE_URL} component={HomeView} />
          <Route path={PageConstant.LOGIN_PAGE_URL} component={LoginView} />
          <Route path={PageConstant.USERS_PAGE_URL} component={UsersView} />
          <Route path={PageConstant.TASK_ADD_PAGE_URL} component={TaskAddView} />
          <Route path={PageConstant.USER_TASK_PAGE_URL} component={UserTaskView} />
          <Route path={PageConstant.REGISTER_PAGE_URL} component={RegisterView} />
          <Route path={PageConstant.USER_EDIT_PAGE_URL} component={UserEditView} />
          <Route path={PageConstant.USER_ADD_PAGE_URL} component={UserAddView} />
          <Route path={PageConstant.TRUCKS_PAGE_URL} component={TrucksView} />
          <Route path={PageConstant.TRUCKS_EDIT_PAGE_URL} component={TrucksEditView} />
          <Route path={PageConstant.TRUCKS_ADD_PAGE_URL} component={TrucksAddView} />
          <Route path={PageConstant.VENDOR_PAGE_URL} component={VendorsView} />
          <Route path={PageConstant.VENDOR_ADD_PAGE_URL} component={VendorAddView} />
          <Route path={PageConstant.VENDOR_EDIT_PAGE_URL} component={VendorEditView} />
          <Route path={PageConstant.FACTORIES_PAGE_URL} component={FactoriesView} />
          <Route path={PageConstant.FACTORY_ADD_PAGE_URL} component={FactoryAddView} />
          <Route path={PageConstant.FACTORY_EDIT_PAGE_URL} component={FactoryEditView} />
          <Route path={PageConstant.TASKS_PAGE_URL} component={TaskView} />
          <Route path={PageConstant.TASK_ADD_PAGE_URL} component={TaskAddView} />
          <Route path={PageConstant.TASK_EDIT_PAGE_URL} component={TaskEditView} />
          <Route path={PageConstant.TASK_ASSIGN_PAGE_URL} component={TaskAssignView} />
          <Route path={PageConstant.ASSIGNED_TASK_PAGE_URL} component={AssignedTaskView} />
          <Route path={PageConstant.ASSIGNED_TASK_DETAIL_PAGE_URL} component={AssignedTaskDetailView} />
          <Route path={PageConstant.TASK_ROUTE_MAP_VIEW} component={TaskRouteMapView} />
          <Route path={PageConstant.DANGER_AREA_ADD_VIEW} component={DangerAreaAddView} />
          <Route path={PageConstant.DANGER_AREAS_VIEW} component={DangerAreasView} />
          <Route path={PageConstant.FACTORY_TASK_V??EW} component={FactoryTaskView} />
          <Route path={PageConstant.FACTORY_ENTRY_V??EW} component={FactoriesEntryView} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
