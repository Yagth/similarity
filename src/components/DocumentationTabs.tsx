import { FC } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui/Tabs";
import SimpleBar from "simplebar-react";
import Code from "@/components/Code";
import { nodejs } from "../helpers/documentation-code.ts";

const DocumentationTabs: FC<> = () => {
  return (
    <Tabs defaultValue="nodejs" className="max-w-2xl w-full">
      <TabsList>
        <TabsTrigger value="nodejs">NodeJS</TabsTrigger>
        <TabsTrigger value="python">Python</TabsTrigger>
      </TabsList>
      <TabsContent value="nodejs">
        <Code language="javascript" code={nodejs} show />
      </TabsContent>
      <TabsContent value="python"></TabsContent>
    </Tabs>
  );
};

export default DocumentationTabs;
