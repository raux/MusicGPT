<h1 align="center">
    <span> MusicGPT</span>
    <img height="30" src="assets/music-icon.svg" alt="MusicGPT logo"/>
</h1>

<p align="center">
    <strong>Generate music from natural language prompts — locally, with no Python required.</strong>
</p>

<p align="center">
    <a href="https://github.com/gabotechs/MusicGPT/releases"><img src="https://img.shields.io/github/v/release/gabotechs/MusicGPT" alt="Release"></a>
    <a href="https://crates.io/crates/musicgpt"><img src="https://img.shields.io/crates/v/musicgpt" alt="Crates.io"></a>
    <a href="https://hub.docker.com/r/gabotechs/musicgpt"><img src="https://img.shields.io/docker/pulls/gabotechs/musicgpt" alt="Docker Pulls"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License"></a>
</p>

---

https://github.com/gabotechs/MusicGPT/assets/45515538/f0276e7c-70e5-42fc-817a-4d9ee9095b4c
<p align="center">
☝️ Turn up the volume!
</p>

## Overview

MusicGPT is a full-stack application for generating music using AI models that
run **entirely on your machine**. It is built with Rust and React, ships as a
single binary, and works on macOS, Linux, and Windows — no Python or heavy ML
frameworks needed.

It currently supports [MusicGen by Meta](https://audiocraft.metademolab.com/musicgen.html)
with multiple model sizes and optional GPU acceleration.

### Roadmap

- [x] Text-conditioned music generation
- [x] Web UI with chat interface and audio playback
- [x] Dark / light theme
- [x] LM Studio AI prompt assistant integration
- [x] GPU acceleration (CUDA, TensorRT, CoreML)
- [ ] Melody-conditioned music generation
- [ ] Indeterminately long / infinite music streams

## Screenshots

<table>
<tr>
<td width="50%">

**Light mode**

<img src="https://github.com/user-attachments/assets/e8e90aa1-de3b-485f-baa8-9b9b11367786" alt="MusicGPT Web UI — light mode" width="100%"/>

</td>
<td width="50%">

**Dark mode**

<img src="https://github.com/user-attachments/assets/46dbf0bd-2d81-42b7-b7a6-a81cd135fe86" alt="MusicGPT Web UI — dark mode" width="100%"/>

</td>
</tr>
</table>

<details>
<summary>Chat sidebar</summary>

<img src="https://github.com/user-attachments/assets/1b1ecfc5-070e-41c9-bfc3-bf7f6263812f" alt="MusicGPT sidebar with chat history" width="600"/>

</details>

## Features

| Feature | Description |
|---------|-------------|
| **Chat-style Web UI** | Conversational interface for writing prompts and playing back generated audio directly in the browser. |
| **CLI mode** | Generate and play music straight from the terminal — great for scripting and quick experiments. |
| **Dark / Light theme** | One-click toggle between dark and light mode. |
| **Chat history** | Persistent chat sessions you can revisit, rename, or delete. |
| **Configurable duration** | Generate audio clips from 1 to 30 seconds. |
| **Multiple model sizes** | Choose from Small, Medium, or Large MusicGen models (plus FP16 and quantized variants). |
| **GPU acceleration** | Optional CUDA, TensorRT (NVIDIA), and CoreML (Apple Silicon) support for faster inference. |
| **LM Studio prompt assistant** | Experimental integration with [LM Studio](https://lmstudio.ai/) to help craft better music prompts using a local LLM. |
| **Cross-platform** | Runs on macOS (Apple Silicon), Linux (x86_64), and Windows (x86_64). |
| **Zero Python** | Pure Rust backend — no Python, pip, or conda needed. |
| **Single binary** | The web UI is bundled into the executable; just download and run. |
| **Docker support** | First-class Docker image with NVIDIA CUDA 12.6.2 for GPU workloads. |

## Install

### macOS and Linux (Homebrew)

```shell
brew install gabotechs/taps/musicgpt
```

### Windows

Download the latest executable:

**[⬇ Download for Windows](https://github.com/gabotechs/MusicGPT/releases/latest/download/musicgpt-x86_64-pc-windows-msvc.exe)**

### Precompiled binaries (all platforms)

| Platform | Link |
|----------|------|
| macOS Apple Silicon | [Download](https://github.com/gabotechs/MusicGPT/releases/latest/download/musicgpt-aarch64-apple-darwin) |
| Linux x86_64 | [Download](https://github.com/gabotechs/MusicGPT/releases/latest/download/musicgpt-x86_64-unknown-linux-gnu) |
| Windows x86_64 | [Download](https://github.com/gabotechs/MusicGPT/releases/latest/download/musicgpt-x86_64-pc-windows-msvc.exe) |

### Docker (recommended for CUDA)

If you want to run MusicGPT with a CUDA-enabled GPU, Docker is the easiest
path — you only need the
[NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)
installed.

```shell
docker pull gabotechs/musicgpt
```

Run with GPU support:

```shell
docker run -it --gpus all -p 8642:8642 \
  -v ~/.musicgpt:/root/.local/share/musicgpt \
  gabotechs/musicgpt --gpu --ui-expose
```

### Cargo (from source)

If you have the [Rust toolchain](https://www.rust-lang.org/tools/install) installed:

```shell
cargo install musicgpt
```

## Usage

MusicGPT offers two interaction modes: a **Web UI** and a **CLI**.

### Web UI mode

Launch the web interface by running:

```shell
musicgpt
```

This opens a chat-like application in your browser where you can:

- Write natural language prompts and receive generated audio
- Play back generated music samples with the built-in audio player
- Browse and manage your chat history via the sidebar drawer
- Configure audio duration (1–30 s) with the duration control
- Toggle between dark and light themes
- Optionally use the **LM Studio prompt assistant** to craft better prompts

To select a different model or enable GPU acceleration:

```shell
musicgpt --gpu --model medium
```

> [!WARNING]
> Medium and Large models require powerful hardware (16 GB+ RAM recommended).

With Docker and CUDA:

```shell
docker run -it --gpus all -p 8642:8642 \
  -v ~/.musicgpt:/root/.local/share/musicgpt \
  gabotechs/musicgpt --ui-expose --gpu
```

### CLI mode

Generate and play music directly in the terminal:

```shell
musicgpt "Create a relaxing LoFi song"
```

Adjust the duration (default is 10 s, max 30 s):

```shell
musicgpt "Create a relaxing LoFi song" --secs 30
```

Use a larger model:

```shell
musicgpt "Create a relaxing LoFi song" --model medium
```

> [!WARNING]
> Medium and Large models require powerful hardware (16 GB+ RAM recommended).

With Docker and CUDA:

```shell
docker run -it --gpus all \
  -v ~/.musicgpt:/root/.local/share/musicgpt \
  gabotechs/musicgpt --gpu "Create a relaxing LoFi song"
```

See all available options:

```shell
musicgpt --help
```

## Models

MusicGPT downloads model weights on first launch from Hugging Face. The
following MusicGen variants are supported:

| Model | Notes |
|-------|-------|
| **Small** (default) | Good balance of speed and quality |
| **Small FP16** | Lower memory usage, slightly slower |
| **Small Quantized** | Fastest, lower quality |
| **Medium** | Higher quality, requires more RAM |
| **Medium FP16** | Lower memory variant of Medium |
| **Medium Quantized** | Faster variant of Medium |
| **Large** | Best quality, requires powerful hardware |

Select a model with the `--model` flag:

```shell
musicgpt --model medium-quantized
```

## GPU Acceleration

MusicGPT supports hardware-accelerated inference through ONNX Runtime:

| Backend | Platform | Flag |
|---------|----------|------|
| **CUDA** | NVIDIA GPUs | `--gpu` (with `cuda` feature) |
| **TensorRT** | NVIDIA GPUs (optimized) | `--gpu` (with `tensorrt` feature) |
| **CoreML** | Apple Silicon | `--gpu` (with `coreml` feature) |
| **CPU** | All platforms | Default (no flag needed) |

Pre-built binaries already include the appropriate GPU support for each
platform. When using Docker, pass `--gpus all` to enable NVIDIA GPU access.

## LM Studio Integration (Experimental)

MusicGPT can optionally connect to [LM Studio](https://lmstudio.ai/) running
locally to provide an AI prompt assistant. This helps you craft more descriptive
and effective music generation prompts.

1. Install and run [LM Studio](https://lmstudio.ai/) with a model loaded
2. Launch MusicGPT and click the **AI Prompt Assistant** button in the chat input area
3. Chat with the assistant to brainstorm prompt ideas, then click **Use as Prompt** to send the result to MusicGPT

The assistant connects to LM Studio's OpenAI-compatible API at
`http://localhost:1234` by default (configurable in the UI).

## Benchmarks

The following graph shows inference time for generating 10 seconds of audio on a
Mac M1 Pro, compared with the Python equivalent using
[huggingface/transformers](https://github.com/huggingface/transformers):

```shell
musicgpt '80s pop track with bassy drums and synth'
```

<details>
<summary>Python comparison script</summary>

```python
import scipy
import time
from transformers import AutoProcessor, MusicgenForConditionalGeneration

processor = AutoProcessor.from_pretrained("facebook/musicgen-small")
model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-small")

inputs = processor(
    text=["80s pop track with bassy drums and synth"],
    padding=True,
    return_tensors="pt",
)

start = time.time()
audio_values = model.generate(**inputs, max_new_tokens=500)
print(time.time() - start)

sampling_rate = model.config.audio_encoder.sampling_rate
scipy.io.wavfile.write("musicgen_out.wav", rate=sampling_rate, data=audio_values[0, 0].numpy())
```

</details>

<p align="center">
<img height="400" src="https://github.com/gabotechs/MusicGPT/assets/45515538/edae3c25-04e3-41c3-a2b5-c0829fa69ee3" alt="Benchmark chart"/>
</p>

## Storage

MusicGPT stores downloaded models, generated audio files, and chat metadata
locally. Assuming your username is `foo`, data is saved at:

| OS | Path |
|----|------|
| **Windows** | `C:\Users\foo\AppData\Roaming\gabotechs\musicgpt` |
| **macOS** | `/Users/foo/Library/Application Support/com.gabotechs.musicgpt` |
| **Linux** | `/home/foo/.config/musicgpt` |

## Architecture

MusicGPT is a full-stack application with:

- **Backend** — Rust (Axum + Tokio) serving a WebSocket API for real-time
  communication, audio generation job processing, and static file serving.
- **Frontend** — React 18 + TypeScript + Tailwind CSS, bundled into a single
  HTML file and embedded in the binary at compile time.
- **AI Engine** — ONNX Runtime for running MusicGen's text encoder, decoder,
  and EnCodec audio codec models.
- **Type Safety** — Auto-generated TypeScript bindings from Rust types via
  [specta](https://github.com/oscartbeaumont/specta), ensuring the WebSocket
  protocol stays in sync.

## License

The code is licensed under the [MIT License](./LICENSE).

The AI model weights downloaded at startup are licensed under
[CC-BY-NC-4.0](https://spdx.org/licenses/CC-BY-NC-4.0) as they are derived
from the following Meta repositories:

- [facebook/musicgen-small](https://huggingface.co/facebook/musicgen-small)
- [facebook/musicgen-medium](https://huggingface.co/facebook/musicgen-medium)
- [facebook/musicgen-large](https://huggingface.co/facebook/musicgen-large)
- [facebook/musicgen-melody](https://huggingface.co/facebook/musicgen-melody)
