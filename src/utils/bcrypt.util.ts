import bcyrpt  from "bcrypt";
export const hash = async(value:string):Promise<string>=>{
    const salt =  await bcyrpt.genSalt(10)
    return  await bcyrpt.hash(value,salt)
}

export const compare = async(hashed:string,plainText:string):Promise<boolean>=>{
    return  await bcyrpt.compare(plainText,hashed)
}