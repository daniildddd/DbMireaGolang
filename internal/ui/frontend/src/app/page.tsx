"use client";

import AppModalLinkList from "@shared/ui/components/AppModalLinkList/AppModalLinkList";
import "./page.sass";

export default function Page() {
  return (
    <main className="main index-page">
      <h1 className="h1 index-page_website-title">DB Master</h1>
      <AppModalLinkList className="vertical" />
    </main>
  );
}
