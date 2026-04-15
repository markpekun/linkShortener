import secrets

SHORT_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
SHORT_CODE_RADIX = len(SHORT_CODE_ALPHABET)


def encode_short_code(number: int) -> str:
    if number < 0:
        raise ValueError("Number must be non-negative")
    if number == 0:
        return SHORT_CODE_ALPHABET[0]

    encoded: list[str] = []
    current = number
    while current > 0:
        current, remainder = divmod(current, SHORT_CODE_RADIX)
        encoded.append(SHORT_CODE_ALPHABET[remainder])
    return "".join(reversed(encoded))


def generate_short_code(length: int) -> str:
    if length <= 0:
        raise ValueError("Short code length must be positive")

    max_value = (SHORT_CODE_RADIX**length) - 1
    random_number = secrets.randbelow(max_value) + 1
    code = encode_short_code(random_number)

    if len(code) < length:
        code = code.rjust(length, SHORT_CODE_ALPHABET[0])
    return code[-length:]
