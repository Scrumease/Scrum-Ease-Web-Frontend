import SidebarItems from "./sidebar/SidebarItems";

export const Sidebar = () => {
  return (
    <div className="drawer-side">
      <label
        htmlFor="my-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <SidebarItems />
    </div>
  );
};
