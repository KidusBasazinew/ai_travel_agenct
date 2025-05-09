import Link from "next/link";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import NavItems from "./NavItems";
import Image from "next/image";
import { useRef } from "react";

const MobileSidebar = () => {
  const sidebarRef = useRef<SidebarComponent>(null);

  const toggleSidebar = () => {
    sidebarRef.current?.toggle();
  };

  return (
    <div className="mobile-sidebar wrapper">
      <header>
        <Link href="/">
          <Image
            width={600}
            height={600}
            src="/assets/icons/logo.svg"
            alt="Logo"
            className="size-[30px]"
          />

          <h1>Tourvisto</h1>
        </Link>

        <button onClick={toggleSidebar}>
          <Image
            src="/assets/icons/menu.svg"
            alt="menu"
            className="size-7"
            width={100}
            height={100}
          />
        </button>
      </header>

      <SidebarComponent
        ref={sidebarRef}
        created={() => sidebarRef.current?.hide()}
        closeOnDocumentClick={true}
        showBackdrop={true}
        type="Over"
        width="270px"
      >
        <div className="nav-items">
          <NavItems handleClick={toggleSidebar} />
        </div>
      </SidebarComponent>
    </div>
  );
};
export default MobileSidebar;
