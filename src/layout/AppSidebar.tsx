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
    path: "/admin/dashboard",
    subItems: [
      { name: "Summary", path: "/admin/dashboard/summary", pro: false },
      { name: "Widgets", path: "/admin/dashboard/widgets", pro: false },
    ],
  },
  {
    icon: <CalenderIcon />,
    name: "Donation",
    path: "/donations",
    subItems: [
      { name: "All Donations", path: "/admin/donations/all", pro: false },
      { name: "Detailed View", path: "/admin/donations/detail", pro: false },
      { name: "Update Status", path: "/admin/donations/status", pro: false },
      { name: "Generate Receipts", path: "/admin/donations/receipts", pro: false },
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: "Campaigns",
    path: "/admin/campaigns",
    subItems: [
      { name: "Ongoing Campaigns", path: "/admin/campaigns/ongoing", pro: false },
      { name: "Upcoming Campaigns", path: "//admincampaigns/upcoming", pro: false },
      { name: "Create Campaign", path: "/admin/campaigns/create", pro: false },
      { name: "Edit Campaign", path: "/admin/campaigns/edit", pro: false },
      { name: "Delete Campaign", path: "/admin/campaigns/delete", pro: false },
      { name: "Track Progress", path: "/admin/campaigns/track", pro: false },
    ],
  },
  {
    icon: <ListIcon />,
    name: "Institutions",
    path: "/institutions",
    subItems: [
      { name: "List Institutions", path: "/admin/institutions/list", pro: false },
      { name: "Add Institution", path: "/admin/institutions/add", pro: false },
      { name: "Edit Institution", path: "/admin/institutions/edit", pro: false },
      { name: "Delete Institution", path: "/admin/institutions/delete", pro: false },
      { name: "View Allocations", path: "/admin/institutions/allocations", pro: false },
    ],
  },
  {
    icon: <TableIcon />,
    name: "Notification System",
    path: "/notifications",
    subItems: [
      { name: "Manage Templates", path: "//adminnotifications/templates", pro: false },
      { name: "Send Notifications", path: "/admin/notifications/send", pro: false },
      { name: "Track Delivery", path: "/admin/notifications/track", pro: false },
    ],
  },
  {
    icon: <PageIcon />,
    name: "Sponsorship Programs",
    path: "/admin/sponsorships",
    subItems: [
      { name: "Yatheem Sponsorships", path: "/admin/sponsorships/yatheem", pro: false },
      { name: "Hafiz Sponsorships", path: "/admin/sponsorships/hafiz", pro: false },
      { name: "List Sponsors", path: "/admin/sponsorships/list", pro: false },
      { name: "Update Status", path: "/admin/sponsorships/status", pro: false },
      { name: "Send Reminders", path: "/admin/sponsorships/reminders", pro: false },
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: "Volunteers",
    path: "/volunteers",
    subItems: [
      { name: "List Volunteers", path: "/admin/volunteers/list", pro: false },
      { name: "Assign Tasks", path: "/admin/volunteers/tasks", pro: false },
      { name: "Track Performance", path: "/admin/volunteers/performance", pro: false },
      { name: "View Logs", path: "/admin/volunteers/logs", pro: false },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Payment Receipts & Records",
    path: "/admin/receipts",
    subItems: [
      { name: "List Receipts", path: "/admin/receipts/list", pro: false },
      { name: "Download Receipts", path: "/admin/receipts/download", pro: false },
      { name: "Print Receipts", path: "/admin/receipts/print", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "Box Collection & Tracking",
    path: "/admin/boxes",
    subItems: [
      { name: "Box Overview", path: "/admin/boxes/overview", pro: false },
      { name: "Track Boxes", path: "/admin/boxes/track", pro: false },
      { name: "Generate Reports", path: "/admin/boxes/reports", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Agents",
    path: "/admin/agents",
    subItems: [
      { name: "List Agents", path: "/admin/agents/list", pro: false },
      { name: "Track Collections", path: "/admin/agents/collections", pro: false },
      { name: "Manage Cycles", path: "/admin/agents/cycles", pro: false },
    ],
  },
  {
    icon: <TableIcon />,
    name: "Settings",
    path: "/admin/settings",
    subItems: [
      { name: "User Management", path: "/admin/settings/users", pro: false },
      { name: "Role Permissions", path: "/admin/settings/roles", pro: false },
      { name: "System Settings", path: "/admin/settings/system", pro: false },
    ],
  },
  {
    icon: <PieChartIcon />,
    name: "Reports",
    path: "/admin/reports",
    subItems: [
      { name: "Generate Reports", path: "/admin/reports/generate", pro: false },
      { name: "Export Reports", path: "/admin/reports/export", pro: false },
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