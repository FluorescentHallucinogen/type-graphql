import { GraphQLResolveInfo } from "graphql";

export default interface ResolverData<
  TContext extends object = {},
  TArgs extends object = {},
  TSource = unknown
> {
  source: TSource;
  args: TArgs;
  context: TContext;
  info: GraphQLResolveInfo;
}
