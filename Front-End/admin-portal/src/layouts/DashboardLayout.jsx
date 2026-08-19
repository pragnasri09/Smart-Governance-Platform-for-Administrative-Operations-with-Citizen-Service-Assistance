import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function DashboardLayout({
  children,
  currentPage,
  onNavigate,
  onLogout,
  title,
  description,
}) {
  return (
    <div className="dashboard-layout">
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="dashboard-main">
        <Topbar
          title={title}
          description={description}
        />

        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;