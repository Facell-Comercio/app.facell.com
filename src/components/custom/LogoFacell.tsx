import { Link } from "react-router-dom";
import logoFacell from "@/assets/images/facell-192x192.png";
import { cn } from "@/lib/utils";

type TLogoFacell = {
    style?: object, 
    className?: string,
}
const LogoFacell = ({style, className}: TLogoFacell) => {
    return ( 
        <Link to="/" style={style} className={cn(className, `flex items-center shrink-0`)}>
            <img src={logoFacell} className={`overflow-hidden transition-all h-10 shrink-0`} alt="" />
            <h3 className="font-semibold text-xl block sm:hidden">Facell</h3>
          </Link>
     );
}
 
export default LogoFacell;