"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { p2pTransfer } from "../app/lib/actions/p2pTransfer"

export function SendCard() {
    const [number, setNumber] = useState("")
    const [amount, setAmount] = useState("")

    return (
        <div className=" flex justify-center items-center h-full">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105 border border-gray-700"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">Send</h2>
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <label htmlFor="number" className="block text-sm font-medium text-gray-300 mb-1">
                            Number
                        </label>
                        <input
                            id="number"
                            type="text"
                            placeholder="Number"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-100 placeholder-gray-400"
                            onChange={(e) => setNumber(e.target.value)}
                            value={number}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                            Amount
                        </label>
                        <input
                            id="amount"
                            type="text"
                            placeholder="Amount"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-100 placeholder-gray-400"
                            onChange={(e) => setAmount(e.target.value)}
                            value={amount}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="pt-4 flex justify-center"
                    >
                        <button
                            onClick={async () => {
                                console.log(number + " " + amount)
                                await p2pTransfer(number, Number(amount) * 100)
                            }}
                            className="bg-purple-600 text-gray-100 px-6 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform transition-all duration-300 hover:scale-105"
                        >
                            Send
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}