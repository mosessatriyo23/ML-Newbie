# Harness Python yang berjalan di dalam Pyodide (Web Worker).
# Tugasnya: menjalankan kode pengguna di namespace baru, menangkap output,
# menangkap grafik Matplotlib, memformat error agar mudah dibaca, dan
# mengevaluasi test case latihan.
import builtins
import io
import linecache
import os
import sys
import traceback
import warnings

os.environ.setdefault("MPLBACKEND", "Agg")

_FIGURES = []


def _capture_figures():
    if "matplotlib.pyplot" not in sys.modules:
        return
    import base64

    import matplotlib.pyplot as plt

    for num in plt.get_fignums():
        fig = plt.figure(num)
        buf = io.BytesIO()
        # Peringatan internal backend Pyodide saat menyimpan gambar bukan berasal dari kode pengguna.
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            fig.savefig(buf, format="png", dpi=100, bbox_inches="tight")
        _FIGURES.append(base64.b64encode(buf.getvalue()).decode("ascii"))
    plt.close("all")


def _prepare_matplotlib():
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    plt.show = lambda *args, **kwargs: _capture_figures()


def _no_input(prompt=""):
    raise RuntimeError(
        "input() tidak tersedia di editor browser ini. "
        "Simpan nilai langsung di variabel, misalnya: nama = 'Budi'"
    )


class _Tee(io.TextIOBase):
    """Menulis ke output asli (ditampilkan di terminal) sekaligus ke buffer (untuk penilaian)."""

    def __init__(self, original, buffer):
        self._original = original
        self._buffer = buffer

    def write(self, text):
        self._buffer.write(text)
        return self._original.write(text)

    def flush(self):
        self._original.flush()

    def writable(self):
        return True


def _format_error(exc):
    te = traceback.TracebackException(type(exc), exc, exc.__traceback__)
    user_frames = [f for f in te.stack if f.filename == "main.py"]
    te.stack = traceback.StackSummary.from_list(user_frames)
    text = "".join(te.format())
    line = None
    if isinstance(exc, SyntaxError) and exc.filename == "main.py":
        line = exc.lineno
    elif user_frames:
        line = user_frames[-1].lineno
    return {
        "type": type(exc).__name__,
        "message": str(exc),
        "line": line,
        "traceback": text,
    }


def _raises(fn, *args, **kwargs):
    """Untuk test: mengembalikan (nama_exception, pesan) jika fn memunculkan error, selain itu None."""
    try:
        fn(*args, **kwargs)
    except Exception as exc:  # noqa: BLE001
        return (type(exc).__name__, str(exc))
    return None


def run_user_code(code, tests_json=None, uses_matplotlib=False):
    import json

    _FIGURES.clear()
    builtins.input = _no_input
    if uses_matplotlib:
        _prepare_matplotlib()

    linecache.cache["main.py"] = (len(code), None, code.splitlines(True), "main.py")
    namespace = {"__name__": "__main__", "__builtins__": builtins}
    captured = io.StringIO()
    original_stdout = sys.stdout
    sys.stdout = _Tee(original_stdout, captured)
    error = None
    try:
        compiled = compile(code, "main.py", "exec")
        exec(compiled, namespace)
    except SystemExit:
        pass
    except BaseException as exc:  # noqa: BLE001 - kita ingin menampilkan semua error ke pengguna
        error = _format_error(exc)
    finally:
        sys.stdout.flush()
        sys.stdout = original_stdout

    _capture_figures()
    output = captured.getvalue()

    test_results = None
    if tests_json:
        tests = json.loads(tests_json)
        test_results = []
        env = dict(namespace)
        env["_output"] = output
        env["_lines"] = [ln.rstrip() for ln in output.strip("\n").split("\n")] if output.strip() else []
        env["_code"] = code
        env["_error"] = error["type"] if error else None
        env["_raises"] = _raises
        sink = io.StringIO()
        for t in tests:
            sys.stdout = sink
            try:
                ok = bool(eval(t["expr"], env))
                test_results.append({"desc": t["desc"], "passed": ok, "error": None})
            except BaseException as exc:  # noqa: BLE001
                test_results.append(
                    {"desc": t["desc"], "passed": False, "error": f"{type(exc).__name__}: {exc}"}
                )
            finally:
                sys.stdout = original_stdout

    return json.dumps(
        {
            "output": output,
            "error": error,
            "figures": list(_FIGURES),
            "tests": test_results,
        }
    )
