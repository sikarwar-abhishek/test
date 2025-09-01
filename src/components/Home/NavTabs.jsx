const TABS = ["Recommended", "Progress", "Trophies"];

function NavTabs({ activeTab, setActiveTab }) {
  return (
    <nav className="border-b border-border sticky top-0 z-50 bg-white font-segeo">
      <div className="flex gap-8">
        {TABS.map((tab) => (
          <Tab
            key={tab}
            tab={tab}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ))}
      </div>
    </nav>
  );
}

function Tab({ tab, setActiveTab, activeTab }) {
  return (
    <button
      key={tab}
      onClick={() => setActiveTab(tab.toLowerCase())}
      className={`pb-2 ${
        activeTab === tab.toLowerCase()
          ? "text-blue-600 font-semibold border-b-2 border-blue-600"
          : "text-muted-foreground font-medium hover:text-foreground"
      }`}
    >
      {tab}
    </button>
  );
}

export default NavTabs;
