import { MoreVertical, ChevronLeft, ChevronRight, CircleDollarSign, ArrowDownSquare, ArrowUpSquare, ArrowDownUp, ChevronDown, ChevronUp } from "lucide-react";
import { FaSackDollar, FaUsers,FaBullhorn, FaTruckRampBox } from 'react-icons/fa6';
import { BsFillBarChartFill, BsFillClipboardCheckFill, BsPersonVideo3, BsFillChatLeftDotsFill, BsFillSendFill } from "react-icons/bs";

export const sidebarItems = [
  {
    name: "Feed",
    type: "link",
    icon: <BsFillSendFill/>,
    uri: "/",
    visible: true,
  },
  {
    name: "Chat",
    type: "link",
    icon: <BsFillChatLeftDotsFill/>,
    uri: "chat/",
    visible: true,
  },
  {
    name: "Dashboard",
    type: "link",
    icon: <BsFillBarChartFill/>,
    uri: "dashboard/",
    visible: true,
  },
  {
    name: "departamentos",
    type: "title",
    spacing: true,
    visible: true,
  },
  {
    name: "Pessoal",
    type: "label",
    icon: <FaUsers/>,
    uri: "pessoal",
    visible: false,
    children: [
      {
        name: "Quadro",
        type: "link",
        shortName: "Q",
        uri: "pessoal/quadro",
        visible: false,
      },
      {
        name: "Fardamentos",
        type: "link",
        shortName: "F",
        uri: "pessoal/fardamentos",
        visible: false,
      },
      {
        name: "Admissões",
        type: "link",
        shortName: "A",
        uri: "pessoal/admissoes",
        visible: false,
      },
    ],
  },
  {
    name: "Treinamento",
    type: "label",
    icon: <BsPersonVideo3/>,
    uri: "treinamento",
    visible: false,
    children: [
      {
        name: "Cursos",
        type: "link",
        shortName: "C",
        uri: "treinamentos/cursos",
        visible: false,
      },
    ],
  },
  {
    name: "Logística",
    type: "label",
    icon: <FaTruckRampBox/>,
    uri: "logistica",
    visible: false,
    children: [
      {
        name: "Inventários",
        type: "link",
        shortName: "INV",
        uri: "logistica/inventarios",
        visible: false,
      },
      {
        name: "Patrimônio",
        type: "link",
        shortName: "PTR",
        uri: "logistica/patrimonio",
        visible: false,
      },
      {
        name: "Avarias e Defeitos",
        type: "link",
        shortName: "AVA",
        uri: "logistica/avarias",
        visible: false,
      },
      {
        name: "Tabela de preços",
        type: "link",
        shortName: "TBP",
        uri: "logistica/tabeladeprecos",
        visible: false,
      },
      {
        name: "Pedidos",
        type: "link",
        shortName: "PED",
        uri: "logistica/pedidos",
        visible: false,
      },
    ],
  },
  {
    name: "Qualidade",
    type: "label",
    icon: <BsFillClipboardCheckFill/>,
    uri: "qualidade",
    visible: false,
    children: [
      {
        name: "Esteira",
        type: "link",
        shortName: "EST",
        uri: "qualidade/esteira",
        visible: false,
      },
    ],
  },
  
  {
    name: "Financeiro",
    type: "label",
    icon: <FaSackDollar/>,
    uri: "financeiro",
    visible: true,
    children: [
      {
        name: "Contas a pagar",
        type: "link",
        shortName: "CP",
        uri: "/financeiro/contas-a-pagar",
        visible: true,
      },
      {
        name: "Contas a receber",
        type: "link",
        shortName: "CR",
        uri: "/financeiro/contas-a-receber",
        visible: true,
      },
      {
        name: "Remuneração TIM",
        type: "link",
        shortName: "TIM",
        uri: "/financeiro/remuneracao-tim",
        visible: false,
      },
    ],
  },
  {
    name: "Marketing",
    type: "label",
    icon: <FaBullhorn/>,
    uri: "marketing",
    visible: false,
    children: [
      {
        name: "Patrocinado",
        type: "link",
        shortName: "PAT",
        uri: "marketing/patrocinado",
        visible: false,
      },
      {
        name: "Ações",
        type: "link",
        shortName: "AÇO",
        uri: "marketing/acoes",
        visible: false,
      },
      {
        name: "Leads",
        type: "link",
        shortName: "LEA",
        uri: "marketing/leads",
        visible: false,
      },
    ],
  },

];
