import React, { useState, useEffect } from "react";
import Web3 from "web3";

/**
 *  web3-eth 用来与以太坊区块链及合约的交互；
 *  web3-shh Whisper 协议相关，进行p2p通信和广播；
 *  web3-bzz swarm 协议（去中心化文件存储）相关；
 *  web3-utils 包含一些对 DApp 开发者有用的方法。
 */
console.log(window.$web3, "window.$web3");
// 检查是否存在 ethereum 对象
if (window.ethereum) {
  const ethereum = window.ethereum;

  // 请求用户授权
  ethereum
    .request({ method: "eth_requestAccounts" })
    .then((accounts) => {
      console.log(accounts, "accounts00000");
      const account = accounts[0];
      console.log("已连接到账户:", account);

      // 实例化 Web3 对象
      const web3 = new Web3(ethereum);
      /**
       * 获取节点的以太坊协议版本
       */
      web3.eth.getProtocolVersion().then((res) => {
        console.log(parseInt(res, 16), "res-----getProtocolVersion-----");
      });
      /**
       * 网络状态查询
       * 是否有节点连接监昕，返回tnue/false
       */
      web3.eth.net.isListening().then((res) => {
        console.log(res, "res-----isListening-----");
      });
      // 现在可以使用 web3 对象进行以太坊操作
      web3.eth.getBalance(account).then((balance) => {
        console.log(Number(balance), "balance00000");
        console.log(BigInt(0));
      });
      // web3.eth.getBlock(48).then((result) => {
      //   console.log(JSON.stringify(result), 2222222);
      // });
      /**gasPrice 查询 */
      web3.eth.getGasPrice().then((res: any) => {
        console.log(Number(res), "getGasPrice---------");
      });
    })
    .catch((error) => {
      console.error("请求授权失败:", error);
    });
} else {
  console.error("未检测到 ethereum 对象，请确保以太坊钱包已安装并登录。");
}

function WEB3Page(props: any) {
  return (
    <>
      <h1>testWeb</h1>
    </>
  );
}
export default WEB3Page;
