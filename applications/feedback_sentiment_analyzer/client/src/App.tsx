import AppLayout from "@cloudscape-design/components/app-layout";
import { useEffect } from "react";

import "./App.css";
import LoginNavigation from "./LoginNavigation";
import { useStore } from "./store";
import FeedbackLayout from "./FeedbackLayout";

function App() {
  const { checkAuth, token } = useStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth, token]);

  return (
    <>
      <LoginNavigation title="Analyseur de sentiments de feedback" />
      <AppLayout
        toolsHide={true}
        navigationHide={true}
        contentType="cards"
        content={<FeedbackLayout />}
      />
    </>
  );
}

export { App };