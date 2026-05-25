import { Route, Switch } from "wouter";
import { WeddingPage } from "@/pages/WeddingPage";
import Admin from "@/pages/Admin";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={WeddingPage} />
        <Route path="/admin" component={Admin} />
      </Switch>
      <Toaster />
    </>
  );
}
