"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons/index";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
    subItems: [
      { name: "Summary", path: "/dashboard/summary", pro: false },
      { name: "Widgets", path: "/dashboard/widgets", pro: false },
    ],
  },
  {
    icon: <CalenderIcon />,
    name: "Donation",
    path: "/donations",
    subItems: [
      { name: "All Donations", path: "/donations/all", pro: false },
      { name: "Detailed View", path: "/donations/detail", pro: false },
      { name: "Update Status", path: "/donations/status", pro: false },
      { name: "Generate Receipts", path: "/donations/receipts", pro: false },
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: "Campaigns",
    path: "/campaigns",
    subItems: [
      { name: "Ongoing Campaigns", path: "/campaigns/ongoing", pro: false },
      { name: "Upcoming Campaigns", path: "/campaigns/upcoming", pro: false },
      { name: "Create Campaign", path: "/campaigns/create", pro: false },
      { name: "Edit Campaign", path: "/campaigns/edit", pro: false },
      { name: "Delete Campaign", path: "/campaigns/delete", pro: false },
      { name: "Track Progress", path: "/campaigns/track", pro: false },
    ],
  },
  {
    icon: <ListIcon />,
    name: "Institutions",
    path: "/institutions",
    subItems: [
      { name: "List Institutions", path: "/institutions/list", pro: false },
      { name: "Add Institution", path: "/institutions/add", pro: false },
      { name: "Edit Institution", path: "/institutions/edit", pro: false },
      { name: "Delete Institution", path: "/institutions/delete", pro: false },
      { name: "View Allocations", path: "/institutions/allocations", pro: false },
    ],
  },
  {
    icon: <TableIcon />,
    name: "Notification System",
    path: "/notifications",
    subItems: [
      { name: "Manage Templates", path: "/notifications/templates", pro: false },
      { name: "Send Notifications", path: "/notifications/send", pro: false },
      { name: "Track Delivery", path: "/notifications/track", pro: false },
    ],
  },
  {
    icon: <PageIcon />,
    name: "Sponsorship Programs",
    path: "/sponsorships",
    subItems: [
      { name: "Yatheem Sponsorships", path: "/sponsorships/yatheem", pro: false },
      { name: "Hafiz Sponsorships", path: "/sponsorships/hafiz", pro: false },
      { name: "List Sponsors", path: "/sponsorships/list", pro: false },
      { name: "Update Status", path: "/sponsorships/status", pro: false },
      { name: "Send Reminders", path: "/sponsorships/reminders", pro: false },
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: "Volunteers",
    path: "/volunteers",
    subItems: [
      { name: "List Volunteers", path: "/volunteers/list", pro: false },
      { name: "Assign Tasks", path: "/volunteers/tasks", pro: false },
      { name: "Track Performance", path: "/volunteers/performance", pro: false },
      { name: "View Logs", path: "/volunteers/logs", pro: false },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Payment Receipts & Records",
    path: "/receipts",
    subItems: [
      { name: "List Receipts", path: "/receipts/list", pro: false },
      { name: "Download Receipts", path: "/receipts/download", pro: false },
      { name: "Print Receipts", path: "/receipts/print", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "Box Collection & Tracking",
    path: "/boxes",
    subItems: [
      { name: "Box Overview", path: "/boxes/overview", pro: false },
      { name: "Track Boxes", path: "/boxes/track", pro: false },
      { name: "Generate Reports", path: "/boxes/reports", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Agents",
    path: "/agents",
    subItems: [
      { name: "List Agents", path: "/agents/list", pro: false },
      { name: "Track Collections", path: "/agents/collections", pro: false },
      { name: "Manage Cycles", path: "/agents/cycles", pro: false },
    ],
  },
  {
    icon: <TableIcon />,
    name: "Settings",
    path: "/settings",
    subItems: [
      { name: "User Management", path: "/settings/users", pro: false },
      { name: "Role Permissions", path: "/settings/roles", pro: false },
      { name: "System Settings", path: "/settings/system", pro: false },
    ],
  },
  {
    icon: <PieChartIcon />,
    name: "Reports",
    path: "/reports",
    subItems: [
      { name: "Generate Reports", path: "/reports/generate", pro: false },
      { name: "Export Reports", path: "/reports/export", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${
        isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
          ? "w-[290px]"
          : "w-[90px]"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;