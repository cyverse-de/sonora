import { camelcaseit } from '../../../common/functions';

export default async (resolve, parent, args, context, info) => {
    const result = await resolve(parent, args, context, info);
    return camelcaseit(result);
};