const fs = require('fs').promises ;

const deleteImg=async(imageDeletePath)=>{
    try {
        await fs.access(imageDeletePath);
        await fs.unlink(imageDeletePath);
        console.log('image was deleted');
    } catch (error) {
        console.log(`${error} image does not exits`);
        throw error;
    }
}

module.exports = deleteImg;