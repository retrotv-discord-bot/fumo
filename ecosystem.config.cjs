module.exports = {
    apps: [
        {
            name: "fumo-bot",
            cwd: __dirname,
            script: "./index.ts",
            interpreter: "node",
            interpreter_args: "--import tsx",
            out_file: "./logs/fumo-bot.out.log",
            error_file: "./logs/fumo-bot.error.log",
            pid_file: "./logs/fumo-bot.pid",
            merge_logs: true,
            exec_mode: "fork",
            instances: 1,
            autorestart: true,
            max_restarts: 10,
            restart_delay: 5000,
            kill_timeout: 10000,
            time: true,
            env: {
                NODE_ENV: "prod",
            },
        },
    ],
};
