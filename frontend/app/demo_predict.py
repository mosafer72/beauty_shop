# demo_predict.py
import os
import argparse
import numpy as np
import pandas as pd
import torch
from transformers import RobertaTokenizer
import models

def encode(code: str, tokenizer, block_size: int):
    tokens = tokenizer.tokenize(str(code))[: block_size - 2]
    tokens = [tokenizer.cls_token] + tokens + [tokenizer.sep_token]
    ids = tokenizer.convert_tokens_to_ids(tokens)
    pad_len = block_size - len(ids)
    if pad_len > 0:
        ids += [tokenizer.pad_token_id] * pad_len
    else:
        ids = ids[:block_size]
    return np.array(ids, dtype=np.int64)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tokenizer_name", type=str, required=True, help="e.g. ../codebert or microsoft/codebert-base")
    ap.add_argument("--checkpoint", type=str, required=True, help="path to saved model state_dict")
    ap.add_argument("--block_size", type=int, default=512)

    # optional: read from csv
    ap.add_argument("--csv", type=str, default=None, help="csv file path")
    ap.add_argument("--text_col", type=str, default="func")
    ap.add_argument("--n", type=int, default=5, help="how many rows to demo from csv")

    # optional: manual code
    ap.add_argument("--code", type=str, default=None, help="single code snippet as a string")

    args = ap.parse_args()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    tokenizer = RobertaTokenizer.from_pretrained(args.tokenizer_name, use_fast=False)

    # ساخت args لازم برای models.MSVD
    # (این باید با چیزی که models.py انتظار داره همخوان باشه)
    class A: pass
    margs = A()
    margs.model_type = "roberta"
    margs.model_name_or_path = args.tokenizer_name
    margs.num_class = 2
    margs.bottleneck_width = 768
    margs.num_attention_heads = 12
    margs.number_domain = 1   # برای inference مهم نیست، ولی بعضی مدل‌ها انتظارش رو دارند
    margs.device = device

    model = models.MSVD(margs).to(device)
    sd = torch.load(args.checkpoint, map_location=device)
    model.load_state_dict(sd, strict=True)
    model.eval()

    samples = []

    if args.code:
        samples.append(("manual", args.code))

    if args.csv:
        df = pd.read_csv(args.csv)
        df = df.head(args.n)
        for i, row in df.iterrows():
            samples.append((f"row_{i}", row[args.text_col]))

    if not samples:
        raise SystemExit("Provide --code or --csv")

    print(f"Device: {device}")
    print(f"Loaded checkpoint: {args.checkpoint}")
    print("-" * 80)

    with torch.no_grad():
        for sid, code in samples:
            ids = encode(code, tokenizer, args.block_size)
            x = torch.tensor(ids).unsqueeze(0).to(device)  # [1, block]
            logits = model.predict(x)                      # [1,2]
            prob = torch.softmax(logits, dim=-1)[0, 1].item()
            pred = 1 if prob >= 0.5 else 0

            print(f"[{sid}] pred={pred}  vuln_prob={prob:.4f}")
            print(str(code)[:300].replace("\n", " ") + ("..." if len(str(code)) > 300 else ""))
            print("-" * 80)

if __name__ == "__main__":
    main()