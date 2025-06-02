import { Schema, Document } from 'mongoose';

/* eslint-disable no-param-reassign */

/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */

type ToJSONTransform = (doc: Document, ret: Record<string, any>, options: any) => any;

interface SchemaOptionsWithToJSON {
  toJSON?: {
    transform?: ToJSONTransform;
  };
}

const deleteAtPath = (obj: Record<string, any>, path: string[], index: number): void => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  if (obj[path[index]]) {
    deleteAtPath(obj[path[index]], path, index + 1);
  }
};

const toJSON = <T extends Document>(schema: Schema<T>): void => {
  // Type assertion for the schema options we need
  const schemaWithOptions = schema as Schema<T> & {
    options: SchemaOptionsWithToJSON;
    paths: Record<string, {
      options?: {
        private?: boolean;
      };
    }>;
  };

  let transform: ToJSONTransform | undefined;
  if (schemaWithOptions.options.toJSON?.transform) {
    transform = schemaWithOptions.options.toJSON.transform;
  }

  schemaWithOptions.options.toJSON = Object.assign(schemaWithOptions.options.toJSON || {}, {
    transform(doc: Document, ret: Record<string, any>, options: any) {
      Object.keys(schemaWithOptions.paths).forEach((path) => {
        if (schemaWithOptions.paths[path].options?.private) {
          deleteAtPath(ret, path.split('.'), 0);
        }
      });

      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      // delete ret.createdAt;
      //delete ret.updatedAt;
      
      return transform?.(doc, ret, options) ?? ret;
    },
  });
};

export default toJSON;