const express = require( 'express' );
const router = express.Router();
const {
	upload,
	storage
} = require( '../../middleware/upload' );

const userController = require( '../../controllers/user' );

router.post( '/', upload.single( 'image' ), userController.create );
router.get( '/', userController.read );
router.put( '/:id', upload.single( 'image' ), userController.update );
router.delete( '/:id', userController.delete );
router.get( '/search', userController.search );

module.exports = router;