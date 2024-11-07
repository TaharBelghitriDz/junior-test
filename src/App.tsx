import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import TodoTabs from "./components/todo.tabs";
import { Toaster } from "./components/ui/toaster";
import Login from "./components/login";
import { store } from "./lib/utils";

export default function App() {
  const isVerified = store.useListen((e) => e.isVerified);

  return (
    <Router>
      <main className="w-full min-h-screen h-full bg-zinc-900 flex justify-center items-start p-20 line-clamp-1">
        <Toaster />

        {!isVerified ? (
          <Routes>
            <Route path="*" element={<Login />} />
          </Routes>
        ) : (
          <div className="w-full max-w-3xl flex flex-col gap-5">
            <Navbar />
            <Routes>
              <Route path="/" element={<TodoTabs tab="all" />} />
              <Route path="/complited" element={<TodoTabs tab="complited" />} />
              <Route path="/current" element={<TodoTabs tab="current" />} />
              <Route path="/deleted" element={<TodoTabs tab="deleted" />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        )}
      </main>
    </Router>
  );
}
