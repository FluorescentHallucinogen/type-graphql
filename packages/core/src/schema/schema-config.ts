import IoCContainer from "@src/runtime/container/IoCContainer";
import BuildSchemaOptions from "@src/schema/BuildSchemaOptions";

// TODO: replace with types merge/overwrite
export interface BuildSchemaConfig<TContext extends object = {}>
  extends Omit<BuildSchemaOptions, "container" | "nullableByDefault"> {
  container: IoCContainer<TContext>;
  nullableByDefault: boolean;
}

export function createSchemaConfig<TContext extends object = {}>({
  container,
  nullableByDefault,
  ...otherBuildOptions
}: BuildSchemaOptions<TContext>): BuildSchemaConfig<TContext> {
  return {
    ...otherBuildOptions,
    container: new IoCContainer(container),
    // TODO: extract inline value to defaults config
    nullableByDefault: nullableByDefault ?? false,
  };
}
