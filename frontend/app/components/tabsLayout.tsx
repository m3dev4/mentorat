import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const TabsLayout = () => {
  return (
    <Tabs defaultValue="tab-1">
      <TabsList className="h-auto gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground">
        <TabsTrigger
          value="tab-1"
          className="relative text-2xl after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
        >
          Développement Web
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          className="relative text-2xl after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
        >
          Science des données
        </TabsTrigger>
        <TabsTrigger
          value="tab-3"
          className="relative text-2xl after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
        >
          Leadership
        </TabsTrigger>
        <TabsTrigger
          value="tab-4"
          className="relative text-2xl after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
        >
          Communication
        </TabsTrigger>
        <TabsTrigger
          value="tab-5"
          className="relative text-2xl after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
        >
          Cybersecurité
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tab-1">
        <p className="p-4 text-center text-xs text-muted-foreground">
          Content for Dev web
        </p>
      </TabsContent>
      <TabsContent value="tab-2">
        <p className="p-4 text-center text-xs text-muted-foreground">
          Content for Data Science
        </p>
      </TabsContent>
      <TabsContent value="tab-3">
        <p className="p-4 text-center text-xs text-muted-foreground">
          Content for Leadership
        </p>
      </TabsContent>
      <TabsContent value="tab-4">
        <p className="p-4 text-center text-xs text-muted-foreground">
          Content for Comminucation
        </p>
      </TabsContent>
      <TabsContent value="tab-5">
        <p className="p-4 text-center text-xs text-muted-foreground">
          Content for Cybersecurité
        </p>
      </TabsContent>
    </Tabs>
  );
};

export default TabsLayout;
