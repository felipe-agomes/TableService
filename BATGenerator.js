const fs = require('fs');
const path = require('path');

class BATGenerator {
	BATPath;

	constructor(DBuser, DBPassword, DBTns) {
		this.DBTns = DBTns;
		this.DBPassword = DBPassword;
		this.DBuser = DBuser;
	}

	#validateCTR() {
		if (!this.CTRPath) {
			throw new Error('Primeiro deve ser definido o caminho do CTR');
		}
	}

	#findAllCTRPath() {
		const allCTRFilename = fs.readdirSync(this.CTRPath);
		const allCTRFullPath = allCTRFilename.map((CTRFilename) =>
			path.join(this.CTRPath, CTRFilename),
		);

		return allCTRFullPath;
	}

	#writeBAT() {
		const allCTRFilename = fs
			.readdirSync(this.CTRPath)
			.map((ctr) => ctr.match(/^(.*)\..*/)[1]);

		const allBATInfo = allCTRFilename.map((ctr) => {
			const BATFilename = ctr + '.bat';
			const CTRFilename = ctr + '.ctr';
			const BATFullPath = path.join(this.BATPath, BATFilename);
			const CTRFullPath = path.join(this.CTRPath, CTRFilename);
			return {
				CTRFullPath,
				BATFullPath,
				BATFilename,
			};
		});

		for (const { CTRFullPath, BATFullPath } of allBATInfo) {
			const loader = `sqlldr ${this.DBuser}/${this.DBPassword}@${this.DBTns} CONTROL='${CTRFullPath}'
PAUSE`;

			fs.writeFileSync(BATFullPath, loader);
		}
	}

	createBATInto(fullPath) {
		this.#validateCTR();

		this.BATPath = fullPath;

		const allCTRPath = this.#findAllCTRPath();

		this.#writeBAT(allCTRPath);
	}

	setBATPath(fullPath) {
		this.BATPath = fullPath;
	}

	setCTRFolder(CTRPath) {
		this.CTRPath = CTRPath;
	}
}

module.exports = BATGenerator;
