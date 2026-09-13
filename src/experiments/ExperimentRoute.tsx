import {
  Navigate,
  useParams,
} from "react-router";

import BoyleView from "./boyle";
import JouleView from "./joule";

export default function ExperimentRoute() {
  const { slug } = useParams();

  if (slug === "boyle") {
    return <BoyleView />;
  }

  if (slug === "joule") {
    return <JouleView />;
  }

  return (
    <Navigate
      to="/app/experiments"
      replace
    />
  );
}