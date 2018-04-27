const ERC721ComposableRegistry = artifacts.require("ERC721ComposableRegistry.sol");
const SampleERC721 = artifacts.require("SampleERC721.sol");

contract('ERC721ComposableRegistry', (accounts) => {

    it("I can safely transfer to registry", async () => {
        const registry = await ERC721ComposableRegistry.deployed();
        const erc721 = await SampleERC721.deployed();
        await erc721.create({from: accounts[1]});
        await erc721.create();
        const to = '0x' + erc721.address.substring(2).padStart(64, '0') + '1'.padStart(64, '0');
        // Can't set data parameter for now.
        // See https://github.com/trufflesuite/truffle/issues/569
        await erc721.safeTransferFrom(accounts[0], registry.address, 2/*, to*/);
        const owner = await registry.ownerOf(erc721.address, 2);
        assert.equal(owner, accounts[1]);
    });
});

contract('ERC721ComposableRegistry', (accounts) => {

    it("Registry does not accept random calls about received token", async () => {
        const registry = await ERC721ComposableRegistry.deployed();
        const erc721 = await SampleERC721.deployed();
        await erc721.create();
        try {
            await erc721.fakeOnERC721Received(registry.address, accounts[0], 1, '');
            assert.fail();
        } catch (ignore) {
            if (ignore.name === 'AssertionError') throw ignore;
        }
    });
});

contract('ERC721ComposableRegistry', (accounts) => {

    it("I cannot transfer token owned by another token", async () => {
        const registry = await ERC721ComposableRegistry.deployed();
        const erc721 = await SampleERC721.deployed();
        await erc721.create();
        await erc721.create();
        const to = '0x' + erc721.address.substring(2).padStart(64, '0') + '2'.padStart(64, '0');
        await erc721.safeTransferFrom(accounts[0], registry.address, 1);
        try {
            await erc721.fakeOnERC721Received(registry.address, accounts[0], 1, '');
            assert.fail();
        } catch (ignore) {
            if (ignore.name === 'AssertionError') throw ignore;
        }
    });
});