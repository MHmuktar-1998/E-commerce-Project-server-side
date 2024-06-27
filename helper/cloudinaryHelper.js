const cloudinary = require('../config/cloudinary');
const publicIdWithoutExtentionFromUrl=async(imageUrl)=>{
    try {
        const pathSegment = imageUrl.split('/');

        const lastSecment = pathSegment[pathSegment.length -1];

        const extention = '.jpg' || '.png' || '.jpeg' ;
        const valueWithoutExtention = lastSecment.replace(extention,'');

        return valueWithoutExtention;

    } catch (error) {
        throw error;
    }
}

const deletePublicId=async(folderName,publicId,modelName)=>{
    try {
        const {result} = await cloudinary.uploader.destroy(`${folderName}/${publicId}`);
            console.log(result);
        if(result !== 'ok'){
                throw new Error(`${modelName} was not deleted.please try again`);
            }
    } catch (error) {
        throw error;
    }
}

module.exports = {publicIdWithoutExtentionFromUrl,deletePublicId}