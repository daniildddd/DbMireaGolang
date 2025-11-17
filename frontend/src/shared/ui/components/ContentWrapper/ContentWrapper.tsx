import { PropsWithChildren } from "react";
import s from "./style.module.sass";
import Header from "../Header/Header";
import AsideTableSelector from "../AsideTableSelector/AsideTableSelector";
import Main from "../Main/Main";

export default function ContextWrapper({ children }: PropsWithChildren) {
  return (
    <div className={s["content-wrapper"]}>
      <Header />
      <AsideTableSelector />
      <Main>{children}</Main>
    </div>
  );
}
