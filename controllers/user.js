const userModel = require( '../models' ).User;
const Sequelize = require( 'sequelize' );
const Op = Sequelize.Op;

class UserController {
	static async create( req, res ) {
		const {
			name,
			email,
			phone,
			address
		} = req.body;

		let errors = {};

		if ( !name ) {
			errors.name = "field name harus diisi";
		}

		if ( !email ) {
			errors.email = "field email harus diisi";
		}

		if ( !phone ) {
			errors.phone = "field phone harus diisi";
		} else if ( isNaN( phone ) ) {
			errors.phone = "field phone harus angka";
		}

		if ( !address ) {
			errors.address = "field address harus diisi";
		}

		if ( !req.file ) {
			errors.image = "gambar belum diupload";
		}

		const data = await userModel.create( {
			name: name,
			email: email,
			phone: phone,
			address: address,
			image: req.file.filename
		} );



		res.send( {
			status: true,
			data: data,
			error: errors
		} )
	}

	static read( req, res ) {
		userModel.findAll()
			.then( users => {
				res.status( 200 ).send( {
					status: 'SUCCESS',
					data: users,
					error: null
				} )
			} )
			.catch( error => res.status( 500 ).send( error ) )
	}

	static update( req, res ) {
		const {
			name,
			email,
			phone,
			address
		} = req.body;

		userModel.findByPk( req.params.id )
			.then( user => {
				if ( !user ) {
					res.status( 404 ).send( {
						status: 'ERROR',
						data: null,
						error: 'data tidak ditemukan'
					} )
				} else {
					user.update( {
							name: name,
							email: email,
							phone: phone,
							address: address,
							image: req.file.filename
						} )
						.then( user => {
							res.status( 200 ).send( {
								status: 'SUCCESS',
								data: user,
								error: null
							} )
						} )
						.catch( error => res.status( 500 ).send( error ) )
				}
			} )
			.catch( error => res.status( 500 ).send( error ) )
	}

	static delete( req, res ) {
		userModel.findByPk( req.params.id )
			.then( user => {
				if ( !user ) {
					res.status( 404 ).send( {
						status: 'ERROR',
						data: null,
						error: 'data tidak ditemukan'
					} )
				} else {
					user.destroy()
						.then( user => {
							res.status( 200 ).send( {
								status: 'SUCCESS',
								data: user,
								error: null
							} )
						} )
						.catch( error => res.status( 500 ).send( error ) )
				}
			} )
			.catch( error => res.status( 500 ).send( error ) )
	}

	static search( req, res ) {
		userModel.findAll( {
				where: {
					name: {
						[ Op.like ]: '%' + req.query.name + '%'
					}
				}
			} )
			.then( users => {
				if ( users.length > 0 ) {
					res.status( 200 ).send( {
						status: 'SUCCESS',
						data: users,
						error: null
					} )
				} else {
					res.status( 404 ).send( {
						status: 'ERROR',
						data: null,
						error: 'data tidak ditemukan'
					} )
				}
			} )
			.catch( error => res.status( 500 ).send( error ) )
	}
}

module.exports = UserController;