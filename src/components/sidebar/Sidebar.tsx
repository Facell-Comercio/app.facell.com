import logoFacell from "@/assets/images/facell-192x192.png";
import { useSidebar } from "@/context/sidebar-store";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { Link } from "react-router-dom";
import { sidebarItems } from "./sidebar-items";


export function Sidebar() {
  const [items, setItems] = useState(sidebarItems)

  useEffect(()=>{
    const updatedItems = sidebarItems.filter(item=>item.visible())
    setItems(updatedItems)
  }, [])

  const { sidebarOpen, toggleSidebar, closeSidebar, itemActive, mobile, setMobile, setItemActive } = useSidebar()

  useEffect(() => {
    const currentURI = window.location.pathname;

    const findMatchingItem = (items: typeof sidebarItems) => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.visible()) {
          if (item.type === 'link' && currentURI === item.uri) {
            return { index: i };
          } else if (item.children) {
            const matchingChildIndex = item.children.findIndex(
              (child) => child.type === 'link' && (typeof child.uri === "string" && currentURI.includes(child.uri))
            );
            if (matchingChildIndex !== -1) {
              return { parentIndex: i, index: matchingChildIndex };
            }
          }
        }
      }
      return null;
    };

    const matchingItemIndexes = findMatchingItem(items.filter(item => item.visible));

    if (matchingItemIndexes) {
      setItemActive({
        sub: !!matchingItemIndexes.parentIndex,
        index: matchingItemIndexes.index,
        parentIndex: matchingItemIndexes.parentIndex,
      });
    } else {
      setItemActive({
        sub: false,
        index: null,
        parentIndex: null,
      });
    }

    // Lida com o tamanho da tela e define se é mobile ou não
    const handleResize = () => {
      const windowWidth = window.innerWidth; // Define a consulta de mídia para uma largura máxima de 768px (tamanho de tela de dispositivos móveis)
      if (windowWidth <= 640) {
        setMobile(true); // Chame sua função aqui
      } else {
        setMobile(false)
      }
    };

    // Adiciona um ouvinte de evento de redimensionamento da janela
    window.addEventListener('resize', handleResize);

    // Remove o ouvinte de evento quando o componente é desmontado
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, []);

  const handleToggleSidebar = () => {
    toggleSidebar()
  }

  return (
    <aside className={`h-full shrink-0 ${sidebarOpen ? "w-full sm:w-64" : "w-0 sm:w-20"} relative`}>
      <nav className="h-full flex flex-col border-r shadow-lg ">
        <div className="p-4 pb-2 flex justify-between items-center ">
          <Link to="/" className="flex gap-2 items-center">
            <img src={logoFacell} className={`overflow-hidden transition-all w-16`} alt="" />
            <h3 className="font-semibold text-xl">{sidebarOpen ? "Facell" : ""}</h3>
          </Link>

          <button
            onClick={handleToggleSidebar}
            className={`z-30 flex items-center p-1.5 absolute ${sidebarOpen ? "right-2" : "right-30"
              } sm:-right-4 bottom-8 sm:bottom-auto sm:top-12 rounded-full shadow-lg bg-muted hover:bg-primary hover:text-white  hover:ring-4  text-primary dark:text-white `}
          >
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            <span className="sm:hidden text-sm">Menu</span>
          </button>
        </div>

        {/* {sidebarOpen && (
          <div className="p-3">
            <Input placeholder="Procurar no menu.." />
          </div>
        )} */}

        <ul className={`${sidebarOpen ? "flex" : "hidden"} sm:flex flex-col flex-1 mt-3 px-5 overflow-visible z-20`}>
          {items
            .filter((item) => item.visible)
            .map((item, itemIndex) => (
              <li key={itemIndex}>
                <Link
                  onClick={() => {
                    if (mobile && sidebarOpen && item.type === "link") {
                      closeSidebar()
                    }
                  }}
                  to={(item.type === "link" && item.uri) || "#"}
                  className={`${!sidebarOpen && "justify-center"}  ${item.type === "title" ? "text-primary cursor-default" : " hover:ring-4  light:text-slate-300"
                    } text-sm flex items-center gap-x-4  rounded-md ${item.spacing ? "mt-6" : "mt-1"} ${item.type !== "title" && "hover:bg-primary hover:text-primary-foreground  cursor-pointer"}
              ${(itemActive?.parentIndex === itemIndex || (itemActive?.index === itemIndex && itemActive.sub === false)) && "bg-primary text-white dark:text-white duration-300"}
              `}
                >
                  <div
                    className={`${sidebarOpen ? "justify-between" : "justify-center"} group flex gap-3  w-full items-center p-2`}
                    onClick={() => {
                      if (item.type !== "title") {
                        setItemActive({ sub: false, index: itemIndex, parentIndex: itemIndex });
                      }
                    }}
                  >
                    <div className={` flex gap-3 items-center`}>
                      {item?.icon && <div className="flex items-center justify-center">{item.icon}</div>}
                      {item?.shortName && <div className="flex items-center justify-center">{item.shortName}</div>}
                      {!sidebarOpen && (
                        <div
                          className={`absolute left-full rounded-md px-2 py-1 ml-6 text-nowrap bg-primary font-semibold text-white text-sm opacity-20 invisible -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 `}
                        >
                          {item.name}
                        </div>
                      )}
                      <span className={`${!sidebarOpen && "hidden"} ${item.type === "title" && "uppercase"} text-sm font-semibold`}>{item.name}</span>
                    </div>
                    {item.children && sidebarOpen && <BsChevronDown className={`${itemActive?.index == itemIndex && "rotate-90 duration-300"}`} onClick={() => { }} />}
                  </div>
                </Link>

                {item.children && (
                  <ul className={`${itemActive?.parentIndex === itemIndex ? "flex flex-col" : "hidden"}`}>
                    {item.children
                      .filter((subitem) => subitem.visible() !== false)
                      .map((subitem, subitemIndex) => (
                        <Link onClick={() => {
                          if (mobile && sidebarOpen && subitem.type === "link") {
                            closeSidebar()
                          }
                        }} key={subitemIndex} to={(subitem.type === "link" && subitem.uri) || "#"}>
                          <li
                            className={`
                         hover:ring-4  group flex ml-3 mt-1 px-2 py-2 rounded cursor-pointer hover:bg-primary font-semibold hover:text-white
                        ${sidebarOpen ? "" : "justify-center"}
                        ${itemActive?.parentIndex === itemIndex && itemActive?.sub === true && itemActive?.index === subitemIndex && " bg-primary  text-white"}
                        `}
                            onClick={() => {
                              setItemActive({ sub: true, index: subitemIndex, parentIndex: itemIndex });
                            }}
                          >
                            <span className="text-sm">{sidebarOpen ? subitem.name : subitem.shortName}</span>

                            {!sidebarOpen && (
                              <div
                                className={`absolute left-full rounded-md px-2 py-1 ml-2 text-nowrap bg-primary text-sm opacity-20 invisible -translate-x-2 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
                              >
                                {subitem.name}
                              </div>
                            )}
                          </li>
                        </Link>
                      ))}
                  </ul>
                )}
              </li>

            ))}
        </ul>
      </nav>
    </aside>
  );
}
