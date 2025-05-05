import { Schema, Document, Model } from 'mongoose';

/* eslint-disable no-param-reassign */

interface QueryResult<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

interface PaginationOptions {
  sortBy?: string;
  populate?: string;
  limit?: number;
  page?: number;
}

interface PaginateModel<T extends Document> extends Model<T> {
  paginate(
    filter?: Record<string, any>,
    options?: PaginationOptions
  ): Promise<QueryResult<T>>;
}

export const paginate = <T extends Document>(schema: Schema<T>): void => {
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  schema.statics.paginate = async function (
    filter: Record<string, any> = {},
    options: PaginationOptions = {}
  ): Promise<QueryResult<T>> {
    let sort = '';
    if (options.sortBy) {
      const sortingCriteria: string[] = [];
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    const limit = options.limit && parseInt(options.limit.toString(), 10) > 0 ? parseInt(options.limit.toString(), 10) : 10;
    const page = options.page && parseInt(options.page.toString(), 10) > 0 ? parseInt(options.page.toString(), 10) : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

    if (options.populate) {
      options.populate.split(',').forEach((populateOption) => {
        const populatePaths = populateOption.split('.');
        const populateObject = populatePaths.reverse().reduce((acc: any, path) => {
          return { path, populate: acc };
        }, undefined);
        docsPromise = docsPromise.populate(populateObject);
      });
    }

    const [totalResults, results] = await Promise.all([countPromise, docsPromise.exec()]);
    const totalPages = Math.ceil(totalResults / limit);
    
    return {
      results,
      page,
      limit,
      totalPages,
      totalResults,
    };
  };
};

export default paginate;