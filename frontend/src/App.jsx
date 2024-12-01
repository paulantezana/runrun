import { lazy, Suspense } from "react";
import { Redirect, Route } from "wouter";
import Loading from "shared/components/Loading";
import useAuthStore from "store/useAuthStore";

const Login = lazy(()=> import('./pages/Login'));
const Chat = lazy(()=> import('./pages/Chat'));

function App() {
  const { user } = useAuthStore();

  return (
    <Suspense fallback={<Loading />}>
      <Route path="/">
        {user ? <Redirect to="/chat" /> : <Login />}
      </Route>
      <Route path="/chat">{user ? <Chat /> : <Redirect to="/" />}</Route>
    </Suspense >
  );
}

export default App;
