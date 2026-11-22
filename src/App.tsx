import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import AssessmentsPage from "./pages/AssessmentsPage";
import CheatSheetsPage from "./pages/CheatSheetsPage";
import Dashboard from "./pages/Dashboard";
import LearnIndex from "./pages/LearnIndex";
import LessonPage from "./pages/LessonPage";
import NotFound from "./pages/NotFound";
import PlaygroundPage from "./pages/PlaygroundPage";
import PracticePage from "./pages/PracticePage";
import ProjectsPage from "./pages/ProjectsPage";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";
import VisualLabPage from "./pages/VisualLabPage";
import WorkflowPage from "./pages/WorkflowPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/learn" element={<LearnIndex />} />
        <Route path="/learn/:lessonId" element={<LessonPage />} />
        <Route path="/workflow" element={<WorkflowPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/practice/:tab" element={<PracticePage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/assessments" element={<AssessmentsPage />} />
        <Route path="/assessments/:examId" element={<AssessmentsPage />} />
        <Route path="/cheatsheets" element={<CheatSheetsPage />} />
        <Route path="/visual-lab" element={<VisualLabPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
