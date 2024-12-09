import { checkUserDepartments, hasModuleAccess, hasPermission } from "@/helpers/checkAuthorization";
import { Play, Settings } from "lucide-react";
import { ReactNode } from "react";
import {
  BsFillBarChartFill,
  BsFillChatLeftDotsFill,
  BsFillClipboardCheckFill,
  BsFillSendFill,
  BsPersonVideo3,
} from "react-icons/bs";
import { FaBullhorn, FaRankingStar, FaSackDollar, FaTruckRampBox, FaUsers } from "react-icons/fa6";

export type SidebarItem = {
  name: string;
  type: string;
  icon?: ReactNode;
  uri?: string;
  visible: () => boolean;
  children?: SidebarItem[];
  shortName?: string;
  spacing?: boolean;
};

export const sidebarItems: SidebarItem[] = [
  {
    name: "Feed",
    type: "link",
    icon: <BsFillSendFill />,
    uri: "/",
    visible: () => false,
  },
  {
    name: "Chat",
    type: "link",
    icon: <BsFillChatLeftDotsFill />,
    uri: "/chat",
    visible: () => false,
  },
  {
    name: "Dashboard",
    type: "link",
    icon: <BsFillBarChartFill />,
    uri: "/dashboard",
    visible: () => false,
  },
  {
    name: "departamentos",
    type: "title",
    spacing: true,
    visible: () => true,
  },
  {
    name: "Comercial",
    type: "label",
    icon: <FaRankingStar />,
    uri: "/comercial",
    visible: () => true,
    children: [
      {
        name: "Vales",
        type: "link",
        shortName: "V",
        uri: "/comercial/vales",
        visible: () => hasPermission(["VALES:VER", "MASTER"]),
      },
      {
        name: "Metas",
        type: "link",
        shortName: "M",
        uri: "/comercial/metas",
        visible: () => true,
      },
      {
        name: "Comissionamento",
        type: "link",
        shortName: "E",
        uri: "/comercial/comissionamento",
        visible: () => true,
      },
    ],
  },
  {
    name: "Pessoal",
    type: "label",
    icon: <FaUsers />,
    uri: "/pessoal",
    visible: () => false,
    children: [
      {
        name: "Colaboradores",
        type: "link",
        shortName: "C",
        uri: "/pessoal/colaboradores",
        visible: () => hasPermission(["MASTER"]),
      },
      {
        name: "Quadro",
        type: "link",
        shortName: "Q",
        uri: "/pessoal/quadro",
        visible: () => false,
      },
      {
        name: "Fardamentos",
        type: "link",
        shortName: "F",
        uri: "/pessoal/fardamentos",
        visible: () => false,
      },
      {
        name: "Admissões",
        type: "link",
        shortName: "A",
        uri: "/pessoal/admissoes",
        visible: () => false,
      },
    ],
  },
  {
    name: "Treinamento",
    type: "label",
    // type: "link",
    icon: <BsPersonVideo3 />,
    uri: "/treinamento",
    visible: () => true,
    children: [
      {
        name: "Videoaulas",
        type: "link",
        shortName: "V",
        uri: "/treinamento/videoaula",
        visible: () => true,
        icon: <Play />,
      },
      {
        name: "Cursos",
        type: "link",
        shortName: "C",
        uri: "/treinamento/cursos",
        visible: () => false,
      },
    ],
  },
  {
    name: "Logística",
    type: "label",
    icon: <FaTruckRampBox />,
    uri: "/logistica",
    visible: () => false,
    children: [
      {
        name: "Inventários",
        type: "link",
        shortName: "INV",
        uri: "/logistica/inventarios",
        visible: () => false,
      },
      {
        name: "Patrimônio",
        type: "link",
        shortName: "PTR",
        uri: "/logistica/patrimonio",
        visible: () => false,
      },
      {
        name: "Avarias e Defeitos",
        type: "link",
        shortName: "AVA",
        uri: "/logistica/avarias",
        visible: () => false,
      },
      {
        name: "Tabela de preços",
        type: "link",
        shortName: "TBP",
        uri: "/logistica/tabeladeprecos",
        visible: () => false,
      },
      {
        name: "Pedidos",
        type: "link",
        shortName: "PED",
        uri: "/logistica/pedidos",
        visible: () => false,
      },
    ],
  },
  {
    name: "Qualidade",
    type: "label",
    icon: <BsFillClipboardCheckFill />,
    uri: "/qualidade",
    visible: () => false,
    children: [
      {
        name: "Esteira",
        type: "link",
        shortName: "EST",
        uri: "/qualidade/esteira",
        visible: () => false,
      },
    ],
  },

  {
    name: "Financeiro",
    type: "label",
    icon: <FaSackDollar />,
    uri: "/financeiro",
    visible: () => hasPermission("MASTER") || hasModuleAccess("FINANCEIRO"),
    children: [
      {
        name: "Contas a Pagar",
        type: "link",
        shortName: "CP",
        uri: "/financeiro/contas-a-pagar",
        visible: () => true,
      },
      {
        name: "Contas a Receber",
        type: "link",
        shortName: "CR",
        uri: "/financeiro/contas-a-receber",
        visible: () => true,
      },
      {
        name: "Controle de Caixa",
        type: "link",
        shortName: "CC",
        uri: "/financeiro/controle-de-caixa",
        visible: () => checkUserDepartments("FINANCEIRO") || hasPermission("MASTER"),
      },
      {
        name: "Orçamento",
        type: "link",
        shortName: "ORC",
        uri: "/financeiro/orcamento",
        visible: () => true,
      },
      {
        name: "Conciliação Bancária",
        type: "link",
        shortName: "CBK",
        uri: "/financeiro/conciliacao-bancaria",
        visible: () => checkUserDepartments("FINANCEIRO") || hasPermission("MASTER"),
      },
      {
        name: "Tesouraria",
        type: "link",
        shortName: "T",
        uri: "/financeiro/tesouraria",
        visible: () => checkUserDepartments("FINANCEIRO") || hasPermission("MASTER"),
      },
      {
        name: "Cadastros",
        type: "link",
        shortName: "C",
        uri: "/financeiro/cadastros",
        visible: () => true,
      },
      {
        name: "Remuneração TIM",
        type: "link",
        shortName: "TIM",
        uri: "/financeiro/remuneracao-tim",
        visible: () => false,
      },
      {
        name: "Relatórios",
        type: "link",
        shortName: "R",
        uri: "/financeiro/relatorios",
        visible: () => true,
      },
    ],
  },
  {
    name: "Marketing",
    type: "label",
    icon: <FaBullhorn />,
    uri: "/marketing",
    visible: () => hasModuleAccess("MARKETING") || hasPermission("MASTER"),
    children: [
      {
        name: "Patrocinado",
        type: "link",
        shortName: "PAT",
        uri: "/marketing/patrocinado",
        visible: () => false,
      },
      {
        name: "Ações",
        type: "link",
        shortName: "AÇO",
        uri: "/marketing/acoes",
        visible: () => false,
      },
      {
        name: "Leads",
        type: "link",
        shortName: "LEA",
        uri: "/marketing/leads",
        visible: () => false,
      },
      {
        name: "Mailing",
        type: "link",
        shortName: "M",
        uri: "/marketing/mailing",
        visible: () => hasPermission("MARKETING:MAILING_VER") || hasPermission("MASTER"),
      },
      {
        name: "Cadastros",
        type: "link",
        shortName: "C",
        uri: "/marketing/cadastros",
        visible: () => checkUserDepartments("MARKETING", true) || hasPermission("MASTER"),
      },
    ],
  },

  {
    name: "Administração",
    type: "link",
    icon: <Settings size={16} />,
    uri: "/administracao",
    visible: () => hasPermission("MASTER"),
  },
];
