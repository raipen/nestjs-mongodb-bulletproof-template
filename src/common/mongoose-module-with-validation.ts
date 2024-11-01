import { DynamicModule } from "@nestjs/common";
import { ModelDefinition, MongooseModule } from "@nestjs/mongoose";

export const MongooseModuleWithValidation = (models: ModelDefinition[], connectionName?: string): DynamicModule => {
  return MongooseModule.forFeatureAsync(models.map(model => ({
    name: model.name,
    useFactory: () => {
      const schema = model.schema;
      schema.pre(/update/i, function (next) {
        this.options.runValidators = true;
        next();
      });
      return schema;
    }
  })),
    connectionName);
}
