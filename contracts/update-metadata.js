#!/usr/bin/env node


import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const compiledContractPath = path.join(__dirname, 'artifacts/contracts/SimpleOfferContract.sol/SimpleOfferContract.json');
const metadataPath = path.join(__dirname, '../app/util/metadata.js');

function updateMetadata() {
    try {
        // Read the compiled contract
        console.log('Reading compiled contract from:', compiledContractPath);
        const compiledContract = JSON.parse(fs.readFileSync(compiledContractPath, 'utf8'));

        if (!compiledContract.abi || !compiledContract.bytecode) {
            throw new Error('ABI or bytecode not found in compiled contract');
        }

        // Extract ABI and bytecode
        const abi = compiledContract.abi;
        const bytecode = compiledContract.bytecode;

        console.log('✓ ABI extracted with', abi.length, 'functions/events');
        console.log('✓ Bytecode extracted (length:', bytecode.length, 'chars)');

        // Generate the new metadata.js content
        const metadataContent = `// Compiled data contract ABI.
export const SIMPLEOFFER_CONTRACT = {
    abi: ${JSON.stringify(abi, null, 4)},
    bytecode: "${bytecode}"
};
`;

        // Write to metadata.js
        console.log('Writing to metadata file:', metadataPath);
        fs.writeFileSync(metadataPath, metadataContent, 'utf8');

        console.log('✅ Successfully updated metadata.js with new ABI and bytecode!');

        // Verify the constructor parameters
        const constructor = abi.find(item => item.type === 'constructor');
        if (constructor) {
            console.log('\n📋 Constructor parameters:');
            constructor.inputs.forEach((input, index) => {
                console.log(`  ${index + 1}. ${input.name} (${input.type})`);
            });
        }

    } catch (error) {
        console.error('❌ Error updating metadata:', error.message);
        process.exit(1);
    }
}

// Run the update
updateMetadata();
